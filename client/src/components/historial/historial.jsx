// Historial.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import axios from 'axios'; // No olvides importar axios


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

  const handleView = (record) => {
    if (record.id) {
      // Llamada a la API para obtener las tareas de la sesión
      axios.get(`http://localhost:3000/tareas?idSesion=${record.id}`)
        .then(response => {
          setTaskDataSource(response.data); // Actualiza el estado de las tareas con los datos obtenidos
        })
        .catch(error => {
          console.error('Error al obtener las tareas de la sesión:', error);
        });
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
      title: 'nombre',
      dataIndex: 'nombre',
      width: '30%',
      editable: true,
    },
    {
      title: 'fecha',
      dataIndex: 'fecha',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <a onClick={() => handleView(record)}>Ver</a>
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
      title: 'nombre',
      dataIndex: 'nombre',
      width: '30%',
      editable: true,
    },
    {
      title: 'estimacion',
      dataIndex: 'estimacion',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
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
        <div className="sesiones-titulo" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <h1 style={{ textAlign: 'center' }}>Tabla de sesiones</h1>
        </div>
        <br></br>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <div className="sesiones-tabla" style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
      {/* ... el resto de tu código ... */}
      <div className="historial-tareas">
        <div className="tareas-titulo" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <h1 style={{ textAlign: 'center' }}>Tabla de tareas</h1>
        </div>
        <br></br>
        <Button
          onClick={handleAddTask}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <div className="tareas-tabla" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table
    components={components}
    rowClassName={() => 'editable-row'}
    bordered
    dataSource={taskDataSource} // Usa el estado de las tareas como fuente de datos para la tabla de tareas
    columns={taskColumns}
    style={{ width: '100%' }}
  />
        </div>
      </div>
    </div>
  );
};

export default Historial;
