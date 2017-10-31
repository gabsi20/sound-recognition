import $ from "jquery";
import sound from './sound';
import io from 'socket.io-client';

const socket = io.connect();


$(function() {

  sound(sendData);

  function sendData(event, data) {
    socket.emit(event, data);
  }

});
