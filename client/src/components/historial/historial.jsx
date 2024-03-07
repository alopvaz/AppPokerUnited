import React, { useContext, useEffect, useRef, useState } from 'react';
import {Form, Input, Popconfirm, Table } from 'antd';
import axios from 'axios'; 
import './historial.css';
import PropTypes from 'prop-types';

const EditableContext = React.createContext(null);

// eslint-disable-next-line no-unused-vars
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
  const [taskDataSource, setTaskDataSource] = useState([]);
  const [voteDataSource, setVoteDataSource] = useState([]);
  const [viewingTaskId, setViewingTaskId] = useState(null);
  const [viewingVoteId, setViewingVoteId] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [sessionSearchText, setSessionSearchText] = useState('');
  const [taskSearchText, setTaskSearchText] = useState('');
  const [voteSearchText, setVoteSearchText] = useState('');

  const onSessionSearch = value => {
    setSessionSearchText(value);
  };

  const onTaskSearch = value => {
    setTaskSearchText(value);
  };

  const onVoteSearch = value => {
    setVoteSearchText(value);
  };

  const filteredSessionData = dataSource.filter(item => {
    return Object.values(item).some(s => 
      s.toString().toLowerCase().includes(sessionSearchText.toString().toLowerCase())
    );
  });

  const filteredTaskData = taskDataSource.filter(item => {
    return Object.values(item).some(s => 
      s.toString().toLowerCase().includes(taskSearchText.toString().toLowerCase())
    );
  });

  const filteredVoteData = voteDataSource.filter(item => {
    return Object.values(item).some(s => 
      s.toString().toLowerCase().includes(voteSearchText.toString().toLowerCase())
    );
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
              <a className="custom-link" style={{ marginLeft: '10px' }}>Eliminar</a>
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
      handleSave: handleSaveSesiones,
    }),
  }));

  const handleViewTareas = (record) => {
    if (record.id) { 
      if (viewingTaskId === record.id) {
        setViewingTaskId(null);
      } else {
        axios.get(`http://192.168.20.103:3000/tareas?idSesion=${record.id}`)
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

  const handleDeleteSesiones = (id) => {
    const record = dataSource.find((item) => item.id === id);
    if (record) {
      axios.delete(`http://192.168.20.103:3000/sesiones/${record.id}`)        
      .then(() => {
        const newData = dataSource.filter((item) => item.id !== id);
        setDataSource(newData);
      })
      .catch(error => {
        console.error('Error al eliminar la sesión:', error);
      });
    }
  }
    
  const handleSaveSesiones = (record) => {
    const newData = [...dataSource]; 
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...record });
    setDataSource(newData); 
    const { id, nombre, fecha } = record;
      axios.put(`http://192.168.20.103:3000/sesiones/${id}`, { nombre, fecha })
      .then(() => {
        console.log('Datos actualizados con éxito');
      })
      .catch(error => {
        console.error('Error al actualizar los datos:', error);
      });
  };

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
          <Popconfirm 
            title="Sure to delete?" 
            onConfirm={() => handleDeleteTareas(record.id)}
            overlayStyle={{ backgroundColor: 'lightblue', color: 'black', borderRadius: '10px' }}
            >
            <a className="custom-link" style={{ marginLeft: '10px' }}>Eliminar</a>
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
      handleSave: handleSaveTareas,
    }),
  }));

  const handleSaveTareas = (record) => {
    const newData = [...taskDataSource];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...record });
    setTaskDataSource(newData);
      const { id, nombre, estimacion } = record;
      axios.put(`http://192.168.20.103:3000/tareas/${id}`, { nombre, estimacion })
      .then(() => {
        console.log('Data updated successfully');
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleViewVote = (record) => {
    if (record.id) {
      if (viewingVoteId === record.id) {
        setViewingVoteId(null);
      } else {
        axios.get(`http://192.168.20.103:3000/votaciones?idTarea=${record.id}`)
        .then(response => {
          setVoteDataSource(response.data);
          setViewingVoteId(record.id);
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

  const handleDeleteTareas = (id) => {
    const record = taskDataSource.find((item) => item.id === id);
    if (record) {
      axios.delete(`http://192.168.20.103:3000/tareas/${record.id}`)        
      .then(() => {
        const newData = taskDataSource.filter((item) => item.id !== id);
        setTaskDataSource(newData);
      })
      .catch(error => {
        console.error('Error al eliminar la tarea:', error);
      });
    }
  }

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
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteVotacion(record.id)}>
          <a className="custom-link" style={{ marginLeft: '10px' }}>Eliminar</a>
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
      handleSave: handleSaveVotaciones,
    }),
  }));

  const handleSaveVotaciones = (record) => {
    const newData = [...voteDataSource];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...record });
    setVoteDataSource(newData);
      const { id, votacion } = record;
    console.log(`Votacion ID: ${id}, Votacion: ${votacion}`);
    axios.put(`http://192.168.20.103:3000/votaciones/${id}`, { votacion })
      .then(() => {
        console.log('Datos actualizados con éxito');
      })
      .catch(error => {
        console.error('Error al actualizar los datos:', error);
      });
  };

  const handleDeleteVotacion = (id) => {
    axios.delete(`http://192.168.20.103:3000/votaciones/${id}`)
      .then(() => {
        console.log('Votacion eliminada con éxito');
          const newData = voteDataSource.filter(item => item.id !== id);
        setVoteDataSource(newData);
      })
      .catch(error => {
        console.error('Error al eliminar la votacion:', error);
      });
  };

  useEffect(() => {
    axios.get('http://192.168.20.103:3000/sesiones', { params: dataSource })
    .then(response => {
      setDataSource(response.data);
      if (response.data[0]) {
        setSessionName(response.data[0].nombre);
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos de las sesiones:', error);
    });
  }, []); 

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []); 

  return (
    <div className="main-historial">
      <div className="historial-sesiones">
        <div className="sesiones-titulo">
          <h1 style={{ fontWeight: 'normal' }}>Tabla de sesiones</h1>          
          <span className="separator"></span> 
        </div>
        <div className="sesiones-buscador" style={{ textAlign: 'right' }}>
          <Input.Search
            placeholder="Buscar sesiones"
            onSearch={onSessionSearch}
            style={{ width: 200, marginBottom: '1%' }}
          />
        </div>
        <div className="sesiones-tabla">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={filteredSessionData}
            columns={columns}
          />
        </div>
      </div>
      {viewingTaskId && (
      <div className="historial-tareas">
        <div className="tareas-titulo" style={{ color: 'black', zIndex: 1 }}>
          <h1 style={{ fontWeight: 'normal' }}>Tabla de tareas para {sessionName}</h1>
          <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
        </div>
        <div className="tareas-buscador" style={{ textAlign: 'right' }}>
          <Input.Search
            placeholder="Buscar tareas"
            onSearch={onTaskSearch}
            style={{ width: 200, marginBottom: '1%' }}
          />
        </div>
        <div className="tareas-tabla">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={filteredTaskData}
            columns={taskColumns}
            style={{ width: '100%' }}
          /> 
        </div>
      </div>
      )}
      {viewingVoteId && (
      <div className="historial-votaciones">
      <div className="votaciones-titulo" style={{ color: 'black', zIndex: 1 }}>
        <h1 style={{ fontWeight: 'normal' }}>Tabla de votaciones para {taskName}</h1>
        <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
      </div>
      <div className="votaciones-buscador" style={{ textAlign: 'right' }}>
        <Input.Search
          placeholder="Buscar votaciones"
          onSearch={onVoteSearch}
          style={{ width: 200, marginBottom: '1%' }}
        />
      </div>
      <div className="votaciones-tabla">
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredVoteData}
          columns={voteColumns}
          style={{ width: '100%' }}
        /> 
      </div>
    </div>
    )}
  </div>
  );
};

EditableRow.propTypes = {
  index: PropTypes.number.isRequired,
};

EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.object,
  handleSave: PropTypes.func,
};

export default Historial;
