'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { CtaButton } from '@/components/CtaButton'
import { ContactCard } from '@/components/ContactCard'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { FormBlock as FormBlockType_Generated } from '@/payload-types'
import { ArrowRight } from 'lucide-react'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import './Form.css'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  layout?: FormBlockType_Generated['layout']
  eyebrow?: FormBlockType_Generated['eyebrow']
  heading?: FormBlockType_Generated['heading']
  introText?: FormBlockType_Generated['introText']
  ctaLabel?: FormBlockType_Generated['ctaLabel']
  quickAccessCard?: FormBlockType_Generated['quickAccessCard']
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    layout,
    eyebrow,
    heading,
    introText,
    ctaLabel,
    quickAccessCard,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const effectiveSubmitLabel = layout === 'contact' && ctaLabel ? ctaLabel : submitButtonLabel

  // ── Shared form JSX ──────────────────────────────────────────────────────
  const formJSX = (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && (
        <div className="mb-4 text-sm text-red-400">{`${error.status || '500'}: ${error.message || ''}`}</div>
      )}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 last:mb-0">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                if (Field) {
                  return (
                    <div
                      className={layout === 'contact' ? 'mb-10 last:mb-0' : 'mb-6 last:mb-0'}
                      key={index}
                    >
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </div>
                  )
                }
                return null
              })}
          </div>

          {layout === 'contact' ? (
            <div className="mt-14">
              <CtaButton form={formID} size="md" type="submit">
                {effectiveSubmitLabel}
                <ArrowRight className="h-4 w-4" />
              </CtaButton>
            </div>
          ) : (
            <CtaButton form={formID} size="md" type="submit">
              {effectiveSubmitLabel}
            </CtaButton>
          )}
        </form>
      )}
    </FormProvider>
  )

  // ── Contact layout ───────────────────────────────────────────────────────
  if (layout === 'contact') {
    return (
      <section className="site-section" data-theme="dark">
        <div className="site-container pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            {/* Left: heading + form */}
            <div>
              {eyebrow && (
                <RevealOnScroll delay={0} revealName="contact-eyebrow">
                  <p className="site-section-label mb-3 text-site-accent">
                    {eyebrow}
                  </p>
                </RevealOnScroll>
              )}
              {heading && (
                <RevealOnScroll delay={80} revealName="contact-heading">
                  <h1 className="mb-4 text-[2rem] leading-tight font-bold text-site-text-primary md:text-5xl lg:text-6xl">
                    {heading}
                  </h1>
                </RevealOnScroll>
              )}
              {introText && (
                <RevealOnScroll delay={160} revealName="contact-intro">
                  <p className="mb-10 max-w-lg text-sm leading-[1.7] text-site-text-secondary">
                    {introText}
                  </p>
                </RevealOnScroll>
              )}

              {/* Form with underline-style inputs */}
              <RevealOnScroll delay={240} revealName="contact-form">
                <div className="contact-form">
                  {formJSX}
                </div>
              </RevealOnScroll>
            </div>

            {/* Right: quick access card */}
            {quickAccessCard && (
              <RevealOnScroll className="lg:pt-24" delay={320} revealName="contact-card">
                <ContactCard {...quickAccessCard} />
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── Default layout ───────────────────────────────────────────────────────
  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">{formJSX}</div>
    </div>
  )
}
