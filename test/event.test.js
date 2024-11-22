import { reserveTicket, viewTicket, viewAllAttendees, cancelReservation, modifySeatReservation } from '../src/event/event.controller';
import { EventService } from '../src/event/event.service';
import { responseHandler, errorHandler } from '../src/helpers/responseHandler';

jest.mock('../src/event/event.service');
jest.mock('../src/helpers/responseHandler');

describe('Event Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {}
    };
    mockRes = {};
    jest.clearAllMocks();
  });

  describe('reserveTicket', () => {
    test('should reserve a ticket successfully', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(false);
      EventService.prototype.reserveTicket.mockResolvedValue({ seatNumber: 1, ...mockReq.body });

      await reserveTicket(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 201,
        msg: 'Ticket reserved successfully',
        data: expect.any(Object)
      });
    });

    test('should return error if ticket already exists', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(true);

      await reserveTicket(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 400,
        msg: 'Seat already reserved for this email'
      });
    });
  });

  describe('viewTicket', () => {
    test('should view ticket details successfully', async () => {
      mockReq.query = {
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(true);
      EventService.prototype.viewTicket.mockResolvedValue({ name: 'Test User', seatNumber: 1, ...mockReq.query });

      await viewTicket(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 200,
        msg: 'Ticket details retrieved successfully',
        data: expect.any(Object)
      });
    });

    test('should return error if ticket does not exist', async () => {
      mockReq.query = {
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(false);

      await viewTicket(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 400,
        msg: 'Ticket does not exist'
      });
    });
  });

  describe('viewAllAttendees', () => {
    test('should view all attendees successfully', async () => {
      mockReq.query = { eventDate: '2024-01-01' };

      EventService.prototype.viewAllAttendees.mockResolvedValue([
        { seatNumber: 1, name: 'Test User' },
        { seatNumber: 2, name: 'Test User 2' }
      ]);

      await viewAllAttendees(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 200,
        msg: 'Attendees retrieved successfully',
        data: expect.any(Array)
      });
    });
  });

  describe('cancelReservation', () => {
    test('should cancel reservation successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(true);

      await cancelReservation(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 200,
        msg: 'Reservation cancelled successfully'
      });
    });

    test('should return error if ticket does not exist for cancellation', async () => {
      mockReq.body = {
        email: 'test@example.com',
        eventDate: '2024-01-01'
      };

      EventService.prototype.ticketExists.mockResolvedValue(false);

      await cancelReservation(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith({
        res: mockRes,
        status: 400,
        msg: 'Ticket does not exist'
      });
    });
  });
});