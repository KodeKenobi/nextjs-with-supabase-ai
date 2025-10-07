'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) {
      setStatus('error')
      setMessage('No confirmation code provided')
      return
    }

    const confirmEmail = async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({
          token_hash: code,
          type: 'email'
        })

        if (error) {
          console.error('Confirmation error:', error)
          setStatus('error')
          setMessage(error.message)
        } else {
          setStatus('success')
          setMessage('Email confirmed successfully! You can now sign in.')
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage('An error occurred during confirmation')
      }
    }

    confirmEmail()
  }, [code])

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/login')
    } else {
      router.push('/register')
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Email Confirmation</CardTitle>
            <CardDescription>
              {status === 'loading' && 'Confirming your email...'}
              {status === 'success' && 'Email confirmed successfully!'}
              {status === 'error' && 'Confirmation failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Please wait while we confirm your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="text-sm text-gray-600">{message}</p>
                <Button onClick={handleContinue} className="w-full">
                  Continue to Sign In
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-8 w-8 text-red-600" />
                <p className="text-sm text-red-600">{message}</p>
                <Button onClick={handleContinue} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
