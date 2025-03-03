<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MenuPayment extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data; // Pass the data to the view
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Menu Order Payment Receipt',
            from: env('MAIL_FROM_ADDRESS'),
            to: $this->data['mail'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.menu_payment',
            with: [
                'customerEmail' => $this->data['mail'],
                'totalAmount' => $this->data['totalAmount'],
                'paymentMethod' => $this->data['paymentMethod'],
                'transactionId' => $this->data['transactionId'],
                'orderDate' => $this->data['orderDate'],
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
