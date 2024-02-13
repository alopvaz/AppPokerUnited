import  { useState } from 'react';
import './historial.css';

function Historial() {
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});

  /*useEffect(() => {
    // Llamada a la API para obtener los datos de la tabla de alumnos
    axios.get('http://localhost:3001/alumnos', formData)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de los alumnos:', error);
        setErrors({ message: 'Error al obtener los datos de los alumnos' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array vacío como segundo argumento significa que este efecto se ejecutará solo una vez, al montar el componente*/

  const handleEdit = (id) => {
    setFormData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            editing: !item.editing,
          };
        } else {
          return item;
        }
      })
    );
  };

  const handleInputChange = (event, id) => {
    const { name, value } = event.target;
    setFormData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return { ...item, [name]: value };
        }
        return item;
      })
    );

    if (name === 'nombre' || name === 'apellidos' || name === 'email') {
      if (/[^a-zA-Z\s@.]/.test(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: 'Por favor, introduce un email válido',
        }));
      } else {
        setErrors(prevErrors => {
          const { [name]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };
  const handleSave = (id) => {
    const item = formData.find(item => item.id === id);
    
    console.log('Datos del alumno a enviar:', item);
    
    // Extrae solo los campos que quieres enviar
   // const { nombre, apellidos, email } = item;
  
    // Realiza una solicitud PUT al servidor para actualizar los datos del alumno
   /* axios.put(`http://localhost:3001/alumnos/${id}`, { nombre, apellidos, email })
      .then(response => {
        console.log('Alumno actualizado correctamente:', response.data);
        handleEdit(id); // Cambia el estado de edición después de guardar
      })
      .catch(error => {
        console.error('Error al actualizar el alumno:', error);
      });*/
  };
  
  

  return (
    <div className='main'>
      <div className='container'>
        <br />
        <h1>Edición de usuarios</h1>
        <br />
        <table className="table">
          <thead>
            <tr>
              <th className="th-nombre">Nombre</th>
              <th className="th-apellido">Apellidos</th>
              <th className="th-email">Email</th>
              <th className="th-editar">Editar</th>
            </tr>
          </thead>
          <tbody>
            {formData.map(item => (
              <tr key={item.id}>
                <td>
                  {item.editing ? (
                    <>
                      <input
                        type="text"
                        name="nombre"
                        value={item.nombre}
                        onChange={e => handleInputChange(e, item.id)}
                        style={{ width: '100%' }}
                      />
                      {errors.nombre && <p>{errors.nombre}</p>}
                    </>
                  ) : (
                    item.nombre
                  )}
                </td>
                <td>
                  {item.editing ? (
                    <>
                      <input
                        type="text"
                        name="apellidos"
                        value={item.apellidos}
                        onChange={e => handleInputChange(e, item.id)}
                        style={{ width: '100%' }}
                      />
                      {errors.apellidos && <p>{errors.apellidos}</p>}
                    </>
                  ) : (
                    item.apellidos
                  )}
                </td>
                <td>
                  {item.editing ? (
                    <>
                      <input
                        type="text"
                        name="email"
                        value={item.email}
                        onChange={e => handleInputChange(e, item.id)}
                        style={{ width: '100%' }}
                      />
                      {errors.email && <p>{errors.email}</p>}
                    </>
                  ) : (
                    item.email
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => (item.editing ? handleSave(item.id) : handleEdit(item.id))}
                  >
                    {item.editing ? 'Guardar' : 'Editar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Historial;