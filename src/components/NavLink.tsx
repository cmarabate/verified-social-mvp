'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean
  'aria-label'?: string
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName = '',
  inactiveClassName = '',
  exact = false,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname()
  
  const isActive = exact 
    ? pathname === href
    : pathname.startsWith(href)

  const combinedClassName = `${className} ${isActive ? activeClassName : inactiveClassName}`.trim()

  return (
    <Link href={href} className={combinedClassName} aria-current={isActive ? 'page' : undefined} {...rest}>
      {children}
    </Link>
  )
}
