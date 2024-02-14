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

  
const handleView = (record) => {
  if (record.id) {
    if (viewingTaskId === record.id) {
      // Si ya estamos viendo esta tarea, ocultarla
      setViewingTaskId(null);
    } else {
      // Si no, buscar y mostrar los datos
      axios.get(`http://localhost:3000/tareas?idSesion=${record.id}`)
        .then(response => {
          setTaskDataSource(response.data);
          setViewingTaskId(record.id);
        })
        .catch(error => {
          console.error('Error al obtener las tareas de la sesión:', error);
        });
    }
  } else {
    console.error('Error: record.key es undefined');
  }
};

const handleHideTasks = () => {
  setViewingTaskId(null);
};
// Haz lo mismo para la tabla de votaciohnes

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
        })
        .catch(error => {
          console.error('Error al obtener las votaciones de la tarea:', error);
        });
    }
  } else {
    console.error('Error: record.key es undefined');
  }
};

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: count.toString(),
      nombre: `Edward King ${count}`,
      fecha: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

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
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <a onClick={() => handleView(record)}>
              {viewingTaskId === record.id ? 'Ocultar' : 'Ver'} 
            </a>        
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a style={{ marginLeft: '10px' }}>Delete</a>
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
  useEffect(() => {
    // Llamada a la API para obtener los datos de la tabla de alumnos
    axios.get('http://localhost:3000/sesiones', { params: dataSource })
    .then(response => {
        setDataSource(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de los alumnos:', error);
      });
  }, []); // Sin dependencias, se ejecuta solo una vez

  //Para tareas

  const handleAddTask = () => {
    const newTask = {
      key: count.toString(),
      nombre: `Task ${count}`,
      estimacion: '1h',
    };
    setDataSource([...dataSource, newTask]);
    setCount(count + 1);
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
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
           <a onClick={() => handleViewVote(record)}>
            {viewingVoteId === record.id ? 'Ocultar' : 'Ver'} 
          </a>         
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a style={{ marginLeft: '10px' }}>Delete</a>
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

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []); 

  const voteColumns = [
    {
      title: 'usuario',
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
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        voteDataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a style={{ marginLeft: '10px' }}>Delete</a>
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

  return (
    <div className="main-historial" style={{ width: '100%', padding: '0 20px' }}>
      <div className="historial-sesiones">
        <div className="sesiones-titulo" style={{color: 'black', zIndex: 1 }}>
          <h1 style={{ color: "black" }}>Tabla de sesiones</h1>
          <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
        </div>
        <br></br>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16, backgroundColor: '#5cc1ce' }}
          >
          Add a row
        </Button>
        <div className="sesiones-tabla">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      {viewingTaskId && (
        <div className="historial-tareas">
          <div className="tareas-titulo" style={{ color: 'black', zIndex: 1 }}>
            <h1 style={{ color: 'black' }}>Tabla de tareas</h1>
            <span style={{ display: "block", height: "1px", backgroundColor: "#f0f0f0", margin: "10px 0" }}></span>        
          </div>
          <br></br>
          <Button
            onClick={handleAddTask}
            type="primary"
            style={{ marginBottom: 16, backgroundColor: '#5cc1ce' }}
            >
            Add a row
          </Button>
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
            <h1>Tabla de votaciones</h1>
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


