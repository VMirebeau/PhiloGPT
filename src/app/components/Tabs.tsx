/* eslint-disable react/prop-types */
'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import cx from 'classnames'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cx('inline-flex bg-[#10a37f] items-center justify-center rounded-md p-1 dark:bg-slate-800 text-[#ffffff]', className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cx(
      'inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium  transition-all  disabled:pointer-events-none disabled:bg-[#10a37f] data-[state=active]:bg-white data-[state=active]:text-[#000000] data-[state=active]:shadow-sm dark:text-slate-200 disabled:text-[#ffffff]',
      className,
    )}
    {...props}
    ref={ref}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content className={cx('mt-2 outline-none', className)} {...props} ref={ref} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
