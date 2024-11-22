import { Router } from "express"
import { cancelReservation, modifySeatReservation, reserveTicket, viewAllAttendees, viewTicket } from "./event.controller.js"

const router = Router()

router.get('/health', ((_req, res) => {
  res.status(200).send('OK')
}))

router.post('/reserve', reserveTicket)
router.get('/ticket', viewTicket)
router.get('/view-attendees', viewAllAttendees)
router.post('/ticket/cancel', cancelReservation)
router.patch('/ticket/modify-seat', modifySeatReservation)


export default router
