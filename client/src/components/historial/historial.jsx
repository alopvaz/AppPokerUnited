// Historial.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import axios from 'axios'; // No olvides importar axios
import './historial.css';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Historial = () => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [taskDataSource, setTaskDataSource] = useState([]);
  const [voteDataSource, setVoteDataSource] = useState([]);
  const [viewingTaskId, setViewingTaskId] = useState(null);
const [viewingVoteId, setViewingVoteId] = useState(null);
const [sessionName, setSessionName] = useState('');
const [taskName, setTaskName] = useState('');
const [isAdding, setIsAdding] = useState(false);



const handleSave = (row) => {
  const newData = [...dataSource];
  const index = newData.findIndex((item) => row.key === item.key);
  const item = newData[index];
  newData.splice(index, 1, { ...item, ...row });
  setDataSource(newData);
};

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

//TABLA DE SESIONES

  //Columnas de la tabla de sesiones

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      width: '30%',
      editable: true,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <a className="custom-link" onClick={() => handleViewTareas(record)}>
              {viewingTaskId === record.id ? 'Ocultar' : 'Ver'} 
            </a>        
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteSesiones(record.id)}>
              <a className="custom-link" style={{ marginLeft: '10px' }}>Delete</a>
            </Popconfirm>
            <Popconfirm title="Sure to save?" onConfirm={() => handleSaveSesiones(record)}>
              <a className="custom-link" style={{ marginLeft: '10px' }}>Save</a>
            </Popconfirm>
          </>
        ) : null,
    }
  ].map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  //Funciones para manejar las acciones de la tabla de sesiones

    //handleViewTareas: muestra u oculta las tareas de una sesión

        const handleViewTareas = (record) => {
          if (record.id) {
            if (viewingTaskId === record.id) {
              setViewingTaskId(null);
            } else {
              axios.get(`http://localhost:3000/tareas?idSesion=${record.id}`)
          .then(response => {
            setTaskDataSource(response.data);
            setViewingTaskId(record.id);
            setSessionName(record.nombre);
            if (response.data[0]) {
              setTaskName(response.data[0].nombre);
            }
          })
          .catch(error => {
            console.error('Error al obtener las tareas de la sesión:', error);
          });
            }
          } else {
            console.error('Error: record.key es undefined');
          }
        };

    //handleDeleteSesiones: elimina una fila de la tabla de sesiones

    const handleDeleteSesiones = (id) => {
      // Primero, encontrar el registro correspondiente
      const record = dataSource.find((item) => item.id === id);
      if (record) {
        // Luego, hacer una solicitud DELETE a tu servidor
        axios.delete(`http://localhost:3000/sesiones/${record.id}`)        
        .then(() => {
          // Si la solicitud fue exitosa, eliminar el registro de la vista
          const newData = dataSource.filter((item) => item.id !== id);
          setDataSource(newData);
        })
        .catch(error => {
          console.error('Error al eliminar la sesión:', error);
        });
      }
    }

    //handleSaveSesiones: guarda los cambios en una fila de la tabla de sesiones

    
    const handleSaveSesiones = (record) => {
      // Aquí puedes recoger los datos que necesitas del registro
      const { id, nombre, fecha } = record;
    
      // Hacer una solicitud PUT a la API del servidor con los datos actualizados
      axios.put(`http://localhost:3000/sesiones/${id}`, { nombre, fecha })
        .then(() => {
          console.log('Datos actualizados con éxito');
        })
        .catch(error => {
          console.error('Error al actualizar los datos:', error);
        });
    };

    //TABLA DE TAREAS

      //Columnas de la tabla de tareas

        const taskColumns = [
          {
            title: 'Nombre',
            dataIndex: 'nombre',
            width: '30%',
            editable: true,
          },
          {
            title: 'Estimacion',
            dataIndex: 'estimacion',
            editable: true,
          },
          {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) =>
              dataSource.length >= 1 ? (
                <>
                <a className="custom-link" onClick={() => handleViewVote(record)}>
                  {viewingVoteId === record.id ? 'Ocultar' : 'Ver'} 
                </a>         
                  <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteTareas(record.id)}>
                    <a className="custom-link" style={{ marginLeft: '10px' }}>Delete</a>
                  </Popconfirm>
                  <Popconfirm title="Sure to save?" onConfirm={() => handleSaveTareas(record)}>
                  <a className="custom-link" style={{ marginLeft: '10px' }}>Save</a>
                  </Popconfirm>
                </>
              ) : null,
          },
        ].map((col) => ({
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        }));

         //Funciones para manejar las acciones de la tabla de tareas

            //handleViewVote: muestra u oculta las votaciones de una tarea

              const handleViewVote = (record) => {
                if (record.id) {
                  if (viewingVoteId === record.id) {
                    // Si ya estamos viendo esta votación, ocultarla
                    setViewingVoteId(null);
                  } else {
                    // Si no, buscar y mostrar los datos
                    axios.get(`http://localhost:3000/votaciones?idTarea=${record.id}`)
                    .then(response => {
                      setVoteDataSource(response.data);
                      setViewingVoteId(record.id);
                      // Suponiendo que el nombre de la votación está en el primer elemento
                      if (response.data[0]) {
                        setSessionName(response.data[0].nombre);
                      }
                    })
                    .catch(error => {
                      console.error('Error al obtener las votaciones de la tarea:', error);
                    });
                  }
                } else {
                  console.error('Error: record.key es undefined');
                }
              };

              //handleDeleteTareas: elimina una fila de la tabla de sesiones
              const handleDeleteTareas = (id) => {
                // Primero, encontrar el registro correspondiente
                const record = taskDataSource.find((item) => item.id === id);
                if (record) {
                  // Luego, hacer una solicitud DELETE a tu servidor
                  axios.delete(`http://localhost:3000/tareas/${record.id}`)        
                  .then(() => {
                    // Si la solicitud fue exitosa, eliminar el registro de la vista
                    const newData = taskDataSource.filter((item) => item.id !== id);
                    setTaskDataSource(newData);
                  })
                  .catch(error => {
                    console.error('Error al eliminar la tarea:', error);
                  });
                }
              }

              //handleSaveTareas: guarda los cambios en una fila de la tabla de tareas

            const handleSaveTareas = (record) => {
              // Aquí puedes recoger los datos que necesitas del registro
              const { id, nombre, estimacion } = record;
              console.log(id + nombre + estimacion);
            
              // Hacer una solicitud PUT a la API del servidor con los datos actualizados
              axios.put(`http://localhost:3000/tareas/${id}`, { nombre, estimacion })
                .then(() => {
                  console.log('Datos actualizados con éxito');
                })
                .catch(error => {
                  console.error('Error al actualizar los datos:', error);
                });
            };

    //TABLA DE VOTACIONES

    //Columnas de la tabla de votaciones
    
  const voteColumns = [
    {
      title: 'Usuario',
      dataIndex: 'nombre',
      width: '30%',
      editable: true,
    },
    {
      title: 'Votacion',
      dataIndex: 'votacion',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        voteDataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteVotes(record.id)}>
            <a className="custom-link" style={{ marginLeft: '10px' }}>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ].map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  //Funciones para manejar las acciones de la tabla de votaciones

  //handleDeleteVotes: elimina una fila de la tabla de votaciones

  const handleDeleteVotes = (id) => {
    // Primero, encontrar el registro correspondiente
    /*const record = voteDataSource.find((item) => item.id === id);
    if (record) {
      // Luego, hacer una solicitud DELETE a tu servidor
      axios.delete(`http://localhost:3000/votaciones/${record.id}`)        
      .then(() => {
        // Si la solicitud fue exitosa, eliminar el registro de la vista
        const newData = voteDataSource.filter((item) => item.id !== id);
        setVoteDataSource(newData);
      })
      .catch(error => {
        console.error('Error al eliminar la votación:', error);
      });
    }*/
  }

  useEffect(() => {
    // Llamada a la API para obtener los datos de la tabla de sesiones
    axios.get('http://localhost:3000/sesiones', { params: dataSource })
    .then(response => {
      setDataSource(response.data);
      // Suponiendo que el nombre de la sesión está en el primer elemento
      if (response.data[0]) {
        setSessionName(response.data[0].nombre);
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos de las sesiones:', error);
    });
  }, []); // Sin dependencias, se ejecuta solo una vez
  //Para tareas


  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []); 



  return (
    
    <div className="main-historial">

      <div className="historial-sesiones">
        <div className="sesiones-titulo">
          <h1>Tabla de sesiones</h1>
          <span className="separator"></span> 
        </div>
        <br></br>
        <div className="sesiones-tabla">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </div>

      {viewingTaskId && (
        <div className="historial-tareas">
          <div className="tareas-titulo" style={{ color: 'black', zIndex: 1 }}>
          <h1 style={{ color: 'black' }}>Tabla de tareas para {sessionName}</h1>
            <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
          </div>
          <br></br>
          <div className="tareas-tabla">
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={taskDataSource}
              columns={taskColumns}
              style={{ width: '100%' }}
            /> 
          </div>
        </div>
      )}
      {viewingVoteId && (
        <div className="historial-votaciones">
          <div className="votaciones-titulo" style={{color: 'black', zIndex: 1 }}>
          <h1>Tabla de votaciones para {taskName}</h1>           
            <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
          </div>
          <br></br>
          <div className="votaciones-tabla">
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={voteDataSource}
              columns={voteColumns}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );


};

export default Historial;
