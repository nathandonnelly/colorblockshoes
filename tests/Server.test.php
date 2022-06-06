<?php

require 'vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_test_51HobcAKn24D6RBsQAfYuX2QTikDVnXBxYWSYhFpiiMgZ6tW8oJZlu1bLgJu6XEbSK53D2j0J2Y92niALf0AlOKh200AjS87M8a');

// retrieve JSON from POST body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
$cartContents = $data['cartContents'];
$cartLength = count($cartContents);
$cartTotal = 100;
$totalQuantity = 0;
    
for ($i = 0; $i < $cartLength; $i++) {

    $currentCartObj = $cartContents[$i];
    $currentProduct = $currentCartObj[product];
    $currentProductQuantity = $currentCartObj[quantity];
    $currentProductPriceStr = $currentProduct[price];
    $currentProductPrice = floatval($currentProductPriceStr);
    $currentProductTotalPrice = $currentProductPrice * $currentProductQuantity;
    
    
    $cartTotal = $cartTotal + $currentProductTotalPrice;
    $totalQuantity = $totalQuantity + $currentProductQuantity;
    
    
};

header('Content-Type: application/json');

try {

    // Create a PaymentIntent with amount and currency
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $cartTotal,
        'currency' => 'usd',
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
    ]);

    $output = [
        'clientSecret' => $paymentIntent->client_secret,
        'cartContents' => $cartContents,
        'cartLength' => $cartLength,
        'cartTotal' => $cartTotal,
        'totalQuantity' => $totalQuantity,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}