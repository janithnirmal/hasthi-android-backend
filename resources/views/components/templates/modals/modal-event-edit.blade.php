<template data-tempalte-name="modal-event-edit">
    <div class="modal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content lrv-bg-secondary-800 lrv-text-light">
                <div class="modal-header" data-modal-area="header">
                    <h1 class="text-center fw-bold">Event Edit Modal</h1>
                </div>
                <div class="modal-body" data-modal-area="body p-3">
                    <div id="event-edit-form" class="d-flex flex-column gap-1">
                        <label for="event-title" class="form-label fw-bold">Title</label>
                        <input type="text" id="event-title" name="event_title" class="lrv-form-input"
                            placeholder="Enter event title">

                        <label for="event-description" class="form-label fw-bold">Description</label>
                        <textarea id="event-description" name="event_description" rows="5" cols="10" class="lrv-form-input rounded-3"
                            placeholder="Enter event description"></textarea>

                        <label for="event-date-time" class="form-label fw-bold">Event Date & Time</label>
                        <input type="text" id="event-date-time" name="event_date_time" class="lrv-form-input"
                            placeholder="Select date and time">

                        <label for="event-location" class="form-label fw-bold">Location</label>
                        <input type="text" id="event-location" name="event_location" class="lrv-form-input"
                            placeholder="Enter event location">

                        <label for="event-image" class="form-label fw-bold">Image</label>
                        <input type="file" id="event-image" name="event_image" data-ignore class="lrv-form-input">
                        <div data-container="event_image" data-filter="toImg:event-edit-modal-preview-image">
                        </div>

                        <label for="child-ticket-price" class="form-label fw-bold">Child Ticket Price</label>
                        <input type="number" id="child-ticket-price" name="child_ticket_price" class="lrv-form-input"
                            placeholder="Enter child ticket price">

                        <label for="adult-ticket-price" class="form-label fw-bold">Adult Ticket Price</label>
                        <input type="number" id="adult-ticket-price" name="adult_ticket_price" class="lrv-form-input"
                            placeholder="Enter adult ticket price">

                        <label for="child-total-tickets" class="form-label fw-bold">Total Child Tickets</label>
                        <input type="number" id="child-total-tickets" name="child_total_tickets" class="lrv-form-input"
                            placeholder="Enter total child tickets">

                        <label for="adult-total-tickets" class="form-label fw-bold">Total Adult Tickets</label>
                        <input type="number" id="adult-total-tickets" name="adult_total_tickets" class="lrv-form-input"
                            placeholder="Enter total adult tickets">

                        <div class="d-flex gap-3 w-100">
                            <div class="d-flex flex-column w-50">
                                <label for="child-tickets-available" class="form-label fw-bold">Available Child
                                    Tickets</label>
                                <input type="number" id="child-tickets-available" name="child_tickets_available"
                                    class="lrv-form-input" placeholder="Enter available child tickets">

                            </div>
                            <div class="d-flex flex-column w-50">
                                <label for="adult-tickets-available" class="form-label fw-bold">Available Adult
                                    Tickets</label>
                                <input type="number" id="adult-tickets-available" name="adult_tickets_available"
                                    class="lrv-form-input" placeholder="Enter available adult tickets">
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer" data-modal-area="footer">
                    <button class="lrv-btn lrv-btn-primary">Update</button>
                </div>
            </div>
        </div>
    </div>
</template>
