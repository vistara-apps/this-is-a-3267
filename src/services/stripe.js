// Stripe payment service for subscription management
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Basic fasting timer',
      'Limited AI suggestions',
      'Basic progress tracking'
    ],
    limits: {
      aiInteractions: 5,
      journalEntries: 10,
      historyDays: 30
    }
  },
  PREMIUM_MONTHLY: {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Advanced AI schedule generation',
      'Unlimited daily check-ins',
      'Voice journaling with transcription',
      'Detailed analytics',
      'IPFS audio storage',
      'Export data'
    ],
    limits: {
      aiInteractions: -1, // unlimited
      journalEntries: -1,
      historyDays: -1
    }
  },
  PREMIUM_YEARLY: {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 99.99,
    interval: 'year',
    stripePriceId: 'price_premium_yearly', // Replace with actual Stripe price ID
    features: [
      'All Premium Monthly features',
      '2 months free',
      'Priority support'
    ],
    limits: {
      aiInteractions: -1,
      journalEntries: -1,
      historyDays: -1
    }
  }
}

class StripeService {
  constructor() {
    this.stripe = null
    this.initialized = false
  }

  // Initialize Stripe
  async initialize() {
    if (this.initialized) return this.stripe

    try {
      this.stripe = await getStripe()
      this.initialized = true
      return this.stripe
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
      throw new Error('Payment system unavailable')
    }
  }

  // Check if Stripe is configured
  isConfigured() {
    return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  }

  // Create checkout session for subscription
  async createCheckoutSession(priceId, customerId = null, successUrl = null, cancelUrl = null) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl: successUrl || `${window.location.origin}/subscription/success`,
          cancelUrl: cancelUrl || `${window.location.origin}/subscription/cancel`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      return sessionId
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
    try {
      await this.initialize()
      
      const { error } = await this.stripe.redirectToCheckout({
        sessionId
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      throw error
    }
  }

  // Create subscription checkout flow
  async subscribeToplan(planId, userId) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()]
      if (!plan || !plan.stripePriceId) {
        throw new Error('Invalid subscription plan')
      }

      const sessionId = await this.createCheckoutSession(
        plan.stripePriceId,
        userId
      )

      await this.redirectToCheckout(sessionId)
    } catch (error) {
      console.error('Error subscribing to plan:', error)
      throw error
    }
  }

  // Get customer subscription status
  async getSubscriptionStatus(customerId) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch(`/api/subscription-status/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const data = await response.json()
      return {
        isActive: data.isActive,
        planId: data.planId,
        currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        status: data.status
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return {
        isActive: false,
        planId: 'FREE',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        status: 'inactive'
      }
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      return await response.json()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch(`/api/update-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPriceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  // Create customer portal session
  async createPortalSession(customerId, returnUrl = null) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: returnUrl || window.location.origin
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  }

  // Redirect to customer portal
  async redirectToPortal(customerId) {
    try {
      const portalUrl = await this.createPortalSession(customerId)
      window.location.href = portalUrl
    } catch (error) {
      console.error('Error redirecting to portal:', error)
      throw error
    }
  }
}

// Create singleton instance
export const stripeService = new StripeService()

// Utility functions for subscription management
export const subscriptionUtils = {
  // Get plan by ID
  getPlan(planId) {
    return SUBSCRIPTION_PLANS[planId.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  },

  // Check if user has premium features
  hasPremiumFeatures(planId) {
    const plan = this.getPlan(planId)
    return plan.id !== 'free'
  },

  // Check if feature is available for plan
  hasFeature(planId, feature) {
    const plan = this.getPlan(planId)
    return plan.features.includes(feature)
  },

  // Check if user is within usage limits
  isWithinLimits(planId, usage) {
    const plan = this.getPlan(planId)
    
    for (const [key, limit] of Object.entries(plan.limits)) {
      if (limit !== -1 && usage[key] >= limit) {
        return false
      }
    }
    
    return true
  },

  // Get remaining usage for a limit
  getRemainingUsage(planId, usage, limitType) {
    const plan = this.getPlan(planId)
    const limit = plan.limits[limitType]
    
    if (limit === -1) return -1 // unlimited
    
    return Math.max(0, limit - (usage[limitType] || 0))
  },

  // Format price for display
  formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price)
  },

  // Calculate yearly savings
  getYearlySavings() {
    const monthly = SUBSCRIPTION_PLANS.PREMIUM_MONTHLY.price * 12
    const yearly = SUBSCRIPTION_PLANS.PREMIUM_YEARLY.price
    return monthly - yearly
  },

  // Check if subscription is expiring soon
  isExpiringSoon(currentPeriodEnd, daysThreshold = 7) {
    if (!currentPeriodEnd) return false
    
    const now = new Date()
    const threshold = new Date(now.getTime() + (daysThreshold * 24 * 60 * 60 * 1000))
    
    return currentPeriodEnd <= threshold
  },

  // Get subscription status display text
  getStatusText(status) {
    const statusMap = {
      active: 'Active',
      canceled: 'Canceled',
      incomplete: 'Payment Required',
      incomplete_expired: 'Expired',
      past_due: 'Past Due',
      trialing: 'Trial',
      unpaid: 'Unpaid'
    }
    
    return statusMap[status] || 'Unknown'
  }
}

export default stripeService
