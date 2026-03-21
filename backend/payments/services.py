"""
Paystack Payment Service Layer.

Handles all interactions with the Paystack API:
- Initializing transactions
- Verifying payments
- Webhook signature validation
"""
import hashlib
import hmac
import requests
from django.conf import settings


PAYSTACK_BASE_URL = 'https://api.paystack.co'


def _get_headers():
    """Return authorization headers for Paystack API requests."""
    return {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        'Content-Type': 'application/json',
    }


def initialize_transaction(email: str, amount_naira: float, reference: str, callback_url: str = None) -> dict:
    """
    Initialize a Paystack transaction.
    
    Args:
        email: Customer email address
        amount_naira: Amount in Naira (will be converted to kobo)
        reference: Unique transaction reference
        callback_url: Optional URL to redirect after payment
        
    Returns:
        dict with 'authorization_url', 'access_code', 'reference'
    """
    payload = {
        'email': email,
        'amount': int(amount_naira * 100),  # Paystack expects kobo
        'reference': reference,
        'currency': 'NGN',
    }
    if callback_url:
        payload['callback_url'] = callback_url

    response = requests.post(
        f'{PAYSTACK_BASE_URL}/transaction/initialize',
        json=payload,
        headers=_get_headers(),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    if not data.get('status'):
        raise Exception(data.get('message', 'Paystack initialization failed'))

    return data['data']


def verify_transaction(reference: str) -> dict:
    """
    Verify a Paystack transaction by reference.
    
    Returns:
        dict with transaction data including 'status', 'amount', 'reference'
    """
    response = requests.get(
        f'{PAYSTACK_BASE_URL}/transaction/verify/{reference}',
        headers=_get_headers(),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    if not data.get('status'):
        raise Exception(data.get('message', 'Paystack verification failed'))

    return data['data']


def validate_webhook_signature(payload_body: bytes, signature: str) -> bool:
    """
    Validate a Paystack webhook signature using HMAC SHA512.
    
    Args:
        payload_body: Raw request body bytes
        signature: x-paystack-signature header value
        
    Returns:
        True if signature is valid
    """
    secret = settings.PAYSTACK_SECRET_KEY.encode('utf-8')
    computed = hmac.new(secret, payload_body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(computed, signature)
