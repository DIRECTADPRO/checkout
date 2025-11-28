// src/lib/analytics.ts

// Defines the strict structure for the data payload (Schema Contract)
interface FunnelEventPayload {
    productSlug: string;
    sessionId?: string; // Optional: Session ID for tracking user journey
    eventType: 'view' | 'checkout_init' | 'purchase_success' | 'upsell_accept' | 'upsell_decline' | 'abandoned';
    eventStatus: 'success' | 'failure' | 'abandoned' | 'pending';
    revenueGross?: number; // In cents
    transactionId?: string;
}

/**
 * Logs a specific conversion event to the serverless ingestion endpoint.
 * This function should be called from client-side components (like page.tsx).
 */
export async function logFunnelEvent(payload: FunnelEventPayload): Promise<void> {
    const finalPayload = {
        ...payload,
        // Ensure the timestamp is generated right before sending
        timestamp: new Date().toISOString(), 
    };
    
    // Asynchronously send data to the Netlify Function
    try {
        const response = await fetch('/api/log-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalPayload),
        });

        if (!response.ok) {
            // Log failure to the browser console for debugging
            console.error(`[ANALYTICS FAILURE]: Status ${response.status} - Failed to log event: ${response.statusText}`);
        }
    } catch (error) {
        // Log network errors gracefully
        console.error('Network error during analytics logging:', error);
    }
}