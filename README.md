## Overview

The Subscription Worker is responsible for managing subscription plans and handling scheduled jobs for pending and failed subscriptions. It allows for the creation and management of different subscription tiers and assigns them to customers.

## Features

- Create and manage subscription plans with various pricing and billing cycles.
- Manage customers and assign subscription please and other operation like change subscription status, change subscription, etc.
- Handle scheduled jobs for pending and failed subscriptions using Cron triggers.

## Setup

1. Clone the repository:
   ```bash  
   git clone https://github.com/azam1144/cfw-sbscription.git  
   cd subscription  
   
2. Install dependencies:
   ```bash
   npm install

## Environment Configuration Variables
Set the following environment variables in your wrangler.toml file or through the Cloudflare dashboard:

INVOICE_WORKER_URL: URL to the Billing Engine Worker.

1. 1. Variables and Secrets:
   - INVOICE_WORKER_URL: URL to the Billing/Invoice Engine Worker.

1. KV Namespace Bindings:
    - SUBSCRIPTION_KV 
    - CUSTOMER_KV

2. Example for development:
   - WORKER_URL=http://<your-domain.com>:<port>/

## How to Run Locally
1. To run the worker locally, use:
    ```bash
    npm run dev

## How to Run Locally
1. To run the worker locally, use:
   ```bash
   npm run dev  

This will start the worker on a local server. You can test it using a tool like Postman or curl.


## How to Deploy on Production
1. To deploy the worker to production, run:
   ```bash
   npm run deploy  

Ensure you have configured your environment variables correctly in the Cloudflare dashboard.


## API Documentation
Below is the domain where you can see API Docs

https://subscription.azam-arid1144.workers.dev/
   