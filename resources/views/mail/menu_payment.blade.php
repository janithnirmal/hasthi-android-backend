<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Menu Order Payment Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
        .content { margin-top: 20px; }
        .content p { margin: 5px 0; }
        .order-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .order-table th, .order-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .order-table th { background-color: #f8f8f8; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h2>Thank You for Your Order!</h2>
        <p>Your payment was successful. Below are your order details.</p>
    </div>

    <div class="content">
        <p><strong>Customer Email:</strong> {{ $email }}</p>
        <p><strong>Order Date:</strong> {{ $orderDate }}</p>
        <p><strong>Transaction ID:</strong> {{ $transactionId }}</p>
        <p><strong>Payment Method:</strong> {{ $paymentMethod }}</p>
        
        <hr>

        <p><strong>Paid Amount:</strong> {{ $totalAmount }}</p>


        <p>If you have any questions regarding your order, feel free to contact us.</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} Your Company Name. All Rights Reserved.</p>
    </div>
</div>

</body>
</html>
