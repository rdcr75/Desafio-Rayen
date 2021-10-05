import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Date } from 'prismic-reactjs';
// import { format } from 'date-fns-tz';

// Lista de tutoriales - GET https://rayentutorialtestapp.azurewebsites.net/tutorials
// Detalle - GET https://rayentutorialtestapp.azurewebsites.net/tutorial?description=React
// Agregar - POST https://rayentutorialtestapp.azurewebsites.net/createtutorial
// Eliminar - DELETE https://rayentutorialtestapp.azurewebsites.net/deletetutorials

const url = "https://rayentutorialtestapp.azurewebsites.net/";

class App extends Component {
  state = {
    orden: 'Titulo',
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      nombre: '',
      profesor: '',
      materia: '',
      fecha: Date()
    }
  }
  
  // consulta inicial
  peticionGet = () => {
    axios.get(url+"tutorials").then(response => {
      if(this.state.orden === 'Titulo'){
        this.setState({ data: response.data.sort((a,b) => (a.nombre > b.nombre ? 1 : 0 )) });
      }else{
        this.setState({ data: response.data.sort((a,b) => (a.fecha > b.fecha ? 1 : 0 )) });
      }
    }).catch(error => {
      console.log(error.message);
    })
  }

  // Agregar
  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(url + "createtutorial", this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  // Modificar
  peticionPut = () => {
    axios.put(url + "updatetutorial/" + this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }
  
  // Eliminar
  peticionDelete = () => {
    axios.delete(url + "deletetutorial/" + this.state.form.id).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarTutorial = (tutorial) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: tutorial.id,
        nombre: tutorial.nombre,
        profesor: tutorial.profesor,
        materia: tutorial.materia,
        fecha: tutorial.fecha
      }
    })
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      orden: e.target.value,
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
    console.log(this.state.orden);
    this.peticionGet();
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    
    return (
      <div className="App">
        <br /><br /><br />
        <form>
          Ordenar: 
          <select value={this.state.orden} onChange={this.handleChange}>
              <option value="Titulo">Titulo</option>
              <option value="Fecha">Fecha</option>
          </select>
        </form>
        <br /><br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th>Profesor</th>              
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(
              tutorial => {
                return (
                  <tr>
                    <td>{tutorial.id}</td>
                    <td>{tutorial.nombre}</td>
                    <td>{tutorial.profesor}</td>
                    <td>{tutorial.fecha}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => { this.seleccionarTutorial(tutorial); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => { this.seleccionarTutorial(tutorial); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>+</button>
        
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />
              <label htmlFor="profesor">Profesor</label>
              <input className="form-control" type="text" name="profesor" id="profesor" onChange={this.handleChange} value={form ? form.profesor : ''} />
              <br />
              <label htmlFor="materia">Materia</label>
              <input className="form-control" type="text" name="materia" id="materia" onChange={this.handleChange} value={form ? form.materia : ''} />
              <label htmlFor="fecha">Fecha</label>
              <input className="form-control" type="text" name="fecha" id="fecha" onChange={this.handleChange} value={form ? form.fecha : ''} />
              <label htmlFor="materia_id">Materia ID</label>
              <input className="form-control" type="text" name="materia_id" id="materia_id" onChange={this.handleChange} value={form ? form.materia_id : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar a la Tutorial {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default App;