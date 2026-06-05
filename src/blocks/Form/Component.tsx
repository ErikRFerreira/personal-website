'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { ContactCard } from '@/components/ContactCard'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { FormBlock as FormBlockType_Generated } from '@/payload-types'
import { ArrowRight } from 'lucide-react'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

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
                    <div className="mb-6 last:mb-0" key={index}>
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
            <Button className="gap-2 px-6 py-3" form={formID} type="submit">
              {effectiveSubmitLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button form={formID} type="submit" variant="default">
              {effectiveSubmitLabel}
            </Button>
          )}
        </form>
      )}
    </FormProvider>
  )

  // ── Contact layout ───────────────────────────────────────────────────────
  if (layout === 'contact') {
    return (
      <section className="site-section" data-theme="dark">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            {/* Left: heading + form */}
            <div>
              {eyebrow && (
                <p className="mb-3 font-mono text-[0.6875rem] leading-[1.2] font-bold tracking-[0.18em] text-site-accent uppercase">
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h1 className="mb-4 text-4xl leading-tight font-bold text-site-text-primary md:text-5xl lg:text-6xl">
                  {heading}
                </h1>
              )}
              {introText && (
                <p className="mb-10 max-w-lg text-sm leading-[1.7] text-site-text-secondary">
                  {introText}
                </p>
              )}

              {/* Form with underline-style inputs */}
              <div className="[&_input]:rounded-none [&_input]:border-0 [&_input]:border-b [&_input]:bg-transparent [&_input]:px-0 [&_input]:text-site-text-primary [&_input]:placeholder:text-site-text-muted [&_input]:focus-visible:border-site-border-active [&_input]:focus-visible:ring-0 [&_label]:text-[0.625rem] [&_label]:font-semibold [&_label]:tracking-widest [&_label]:text-site-text-muted [&_label]:uppercase [&_textarea]:rounded-none [&_textarea]:border-0 [&_textarea]:border-b [&_textarea]:bg-transparent [&_textarea]:px-0 [&_textarea]:text-site-text-primary [&_textarea]:placeholder:text-site-text-muted [&_textarea]:focus-visible:border-site-border-active [&_textarea]:focus-visible:ring-0 [&_[role=combobox]]:rounded-none [&_[role=combobox]]:border-0 [&_[role=combobox]]:border-b [&_[role=combobox]]:bg-transparent [&_[role=combobox]]:text-site-text-primary [&_[role=combobox]]:focus:ring-0">
                {formJSX}
              </div>
            </div>

            {/* Right: quick access card */}
            {quickAccessCard && (
              <div className="lg:pt-24">
                <ContactCard {...quickAccessCard} />
              </div>
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
