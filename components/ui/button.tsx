import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-punch/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  {
    variants: {
      variant: {
        default:
          'bg-indigo-punch text-paper-white border border-transparent hover:bg-indigo-punch/90 active:translate-y-px',
        destructive:
          'bg-terracotta text-paper-white border border-transparent hover:bg-terracotta/90',
        outline:
          'border border-ink-black bg-transparent text-graphite hover:bg-graphite hover:text-paper-white',
        secondary:
          'bg-sage-mist text-graphite border border-transparent hover:bg-sage-mist/80',
        ghost:
          'border border-ink-black bg-transparent text-graphite hover:bg-graphite hover:text-paper-white',
        link: 'text-indigo-punch underline-offset-4 hover:underline rounded-none border-transparent bg-transparent',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-4 text-xs has-[>svg]:px-3',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
