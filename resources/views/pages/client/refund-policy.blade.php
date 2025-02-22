@extends('layout.client-layout')
@section('title', 'Refund Policy Page')

@section('content')
<section class="container container-fluid">
    <h1 class="p-4 lrv-font-cormorant-garamond lrv-fs-2 lrv-fw-bold">Refund Policy for hasthi.com</h1>
    <br/>
    <br/>
    <h3 class="text-start">Welcome to hasthi.com!</h3>
    <p class="text-start">
        At hasthi.com, we want you to be completely satisfied with your purchase. If you are not
        satisfied, we're here to help.
    </p>
    <div>
        <ol class="text-start">
            <a href="#pp-t1"><li>Eligibility for Refunds</li></a>
            <a href="#pp-t2"><li>Non-Returnable Items</li></a>
            <a href="#pp-t3"><li>Process for Refunds</li></a>
            <a href="#pp-t4"><li>Refund Approval and Processing</li></a>
            <a href="#pp-t5"><li>Shipping Costs</li></a>
            <a href="#pp-t6"><li>Late or Missing Refunds</li></a>
            <a href="#pp-t7"><li>Exchanges</li></a>
            <a href="#pp-t8"><li>Gifts</li></a>
        </ol>
    </div>
    <br/>
    <h3 id="pp-t1" class="text-start">1. Eligibility for Refunds</h3>
    <p class="text-start">
        To be eligible for a refund, the item must be returned within 30 days of purchase. The item
        must be unused, in the same condition that you received it, and in its original packaging,
        with all tags attached.
    </p>
    <br/>
    <h3 id="pp-t2" class="text-start">2. Non-Returnable Items</h3>
    <p class="text-start">
        Certain items are exempt from being returned, including:
    </p>
    <ul class="text-start">
        <li>Saleitems or items purchased with promotional discounts</li>
        <li>Giftcards</li>
        <li>Itemsmarkedas"Final Sale"</li>
        <li>Undergarments, swimwear, or any other items that have hygiene considerations</li>
    </ul>
    <br/>
    <h3 id="pp-t3" class="text-start">3. Process for Refunds</h3>
    <p class="text-start">
        To initiate a return, please contact our customer service at (<a href="">Customer Service Email</a>/<a href="">Phone
        Number</a>) to obtain a Return Authorization Number. Returns without a Return Authorization
        Number will not be accepted. Once your return is received and inspected, we will notify you
        of the approval or rejection of your refund.
    </p>
    <br/>
    <h3 id="pp-t4" class="text-start">4. Refund Approval and Processing</h3>
    <p class="text-start">
        If approved, your refund will be processed, and a credit will automatically be applied to your
        original method of payment within 7 business days. Please note that it may take additional
        time for your bank or credit card company to process and post the refund to your account.
    </p>
    <br/>
    <h3 id="pp-t5" class="text-start">5. Shipping Costs</h3>
    <p class="text-start">
        Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be
        deducted from your refund unless the return is due to an error on our part such as damaged
        or defective items.
    </p>
    <br/>
    <h3 id="pp-t6" class="text-start">6. Late or Missing Refunds</h3>
    <p class="text-start">
        If you haven’t received a refund yet, first check your bank account again. Then contact your
        credit card company, as it may take some time before your refund is officially posted. If
        you’ve done all of this and you still have not received your refund, please contact us at
        (<a href="">Customer Service Email</a>/<a href="">Phone Number</a>).
    </p>
    <br/>
    <h3 id="pp-t7" class="text-start">7. Exchanges</h3>
    <p class="text-start">
        Weonly replace items if they are defective or damaged. If you need to exchange an item for
        the same product, please contact us at (<a href="">Customer Service Email</a>/<a href="">Phone Number</a>) to arrange
        the exchange process.ny changes indicates your acceptance of the new policy.
    </p>
    <br/>
    <h3 id="pp-t8" class="text-start">8. Gifts</h3>
    <p class="text-start"> 
        If the item was marked as a gift when purchased and shipped directly to you, you’ll receive a
        gift credit for the value of your return. Once the returned item is received, a gift certificate
        will be mailed to you.
    </p>
</section>
@endsection
