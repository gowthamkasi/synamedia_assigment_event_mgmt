import { errorHandler, responseHandler } from '../helpers/responseHandler.js';
import { EventService } from './event.service.js';
import Joi from './event.validator.js';

const eventService = new EventService();

// Reserve Event Ticket API
export const reserveTicket = async (req, res) => {
  try {
    console.log('Inside reserveTicket controller');
    const validator = await Joi(req.body, 'reserveTicket');

    if (validator.error) {
      return errorHandler({
        res,
        err: validator.message,
        status: 400,
      });
    }

    const { name, email, eventDate } = req.body;

    const ticketExists = await eventService.ticketExists(email, eventDate);

    if (ticketExists) {
      return responseHandler({
        res,
        status: 400,
        msg: 'Seat already reserved for this email',
      });
    }

    const reservation = await eventService.reserveTicket(
      name,
      email,
      eventDate
    );

    return responseHandler({
      res,
      status: 201,
      msg: 'Ticket reserved successfully',
      data: reservation,
    });
  } catch (error) {
    errorHandler({ res, status: 500, err: error });
  }
};

// View Reserved Ticket Details API
export const viewTicket = async (req, res) => {
  try {

    console.log('Inside viewTicket controller');

    const { email, eventDate } = req.query;

    const ticketExists = await eventService.ticketExists(email, eventDate);

    if (!ticketExists) {
      return responseHandler({
        res,
        status: 400,
        msg: 'Ticket does not exist',
      });
    }

    const ticketDetails = await eventService.viewTicket(email);
    return responseHandler({
      res,
      status: 200,
      msg: 'Ticket details retrieved successfully',
      data: ticketDetails,
    });
  } catch (error) {
    errorHandler({ res, status: 500, err: error });
  }
};

// View All Attendees API
export const viewAllAttendees = async (req, res) => {
  try {

    console.log('Inside viewAllAttendees controller');

    const { eventDate } = req.query;
    const attendees = await eventService.viewAllAttendees(eventDate);
    return responseHandler({
      res,
      status: 200,
      msg: 'Attendees retrieved successfully',
      data: attendees,
    });
  } catch (error) {
    errorHandler({ res, status: 500, err: error });
  }
};

// Cancel Reservation API
export const cancelReservation = async (req, res) => {
  try {

    console.log('Inside cancelReservation controller');

    const validator = await Joi(req.body, 'cancelReservation');

    if (validator.error) {
      return errorHandler({
        res,
        err: validator.message,
        status: 400,
      });
    }

    const { email, eventDate } = req.body;

    const ticketExists = await eventService.ticketExists(email, eventDate);

    if (!ticketExists) {
      return responseHandler({
        res,
        status: 400,
        msg: 'Ticket does not exist',
      });
    }

    await eventService.cancelReservation(email, eventDate);
    return responseHandler({
      res,
      status: 200,
      msg: 'Reservation cancelled successfully',
    });
  } catch (error) {
    errorHandler({ res, status: 500, err: error });
  }
};

// Modify Seat Reservation API
export const modifySeatReservation = async (req, res) => {
  try {

    console.log('Inside modifySeatReservation controller');

    const validator = await Joi(req.body, 'modifyReservation');

    if (validator.error) {
      return errorHandler({
        res,
        err: validator.message,
        status: 400,
      });
    }

    const { email, eventDate } = req.body;

    const ticketExists = await eventService.ticketExists(email, eventDate);

    if (!ticketExists) {
      return responseHandler({
        res,
        status: 400,
        msg: 'Ticket does not exist',
      });
    }

    const updatedReservation = await eventService.modifySeatReservation(
      email,
      eventDate
    );

    return responseHandler({
      res,
      status: 200,
      msg: 'Seat reservation modified successfully',
      data: updatedReservation,
    });
  } catch (error) {
    errorHandler({ res, status: 500, err: error });
  }
};
