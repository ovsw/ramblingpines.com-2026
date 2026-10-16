"use client";

import { AlertBar } from "./alert-bar";
import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HeaderBrand } from "./brand";
import { HeaderLink } from "./header-link";
import type { HeaderModel, HeaderNavigationModel } from "./model";
import { NavigationIcon } from "./navigation-icon";

export function HeaderNavigation({
  navigation,
}: {
  navigation: HeaderNavigationModel;
}) {
  return (
    <nav aria-label="Main navigation" className="shell-main-menu flex items-center gap-6">
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="shell-menu-items">
          {navigation.items.map((item) => (
            <NavigationMenuItem key={item.key}>
              {item.kind === "link" ? (
                <NavigationMenuLink asChild>
                  <HeaderLink
                    className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                    link={item.link}
                  />
                </NavigationMenuLink>
              ) : (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="shell-dropdown">
                    <ul className="shell-mega-menu grid w-[36rem] grid-cols-2 gap-1 p-6">
                      {item.links.map((child) => (
                        <li key={child.key}>
                          <NavigationMenuLink asChild>
                            <HeaderLink
                              className="flex gap-3 rounded-md p-3 hover:bg-accent"
                              link={child.link}
                            >
                              {child.icon && (
                                <NavigationIcon icon={child.icon} />
                              )}
                              <span>
                                <span className="block text-sm font-medium">
                                  {child.label}
                                </span>
                                {child.description && (
                                  <span className="mt-1 block text-sm text-muted-foreground">
                                    {child.description}
                                  </span>
                                )}
                              </span>
                            </HeaderLink>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-2">
        {navigation.actions.map((action) => (
          <Button asChild size="compact" key={action.key}>
            <HeaderLink link={action.link} />
          </Button>
        ))}
      </div>
    </nav>
  );
}

export function Header({ model }: { model: HeaderModel }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <AlertBar alert={model.alertBar} />
      <div className="shell-top-links">
        {(model.topLinkColumns ?? []).map((column) => <nav aria-label={column.label} key={column.key}>
          {column.links.map((link) => <HeaderLink key={link.href} link={link} />)}
        </nav>)}
      </div>
      <div className="container shell-header-inner">
        <div className="shell-desktop-header">
          <Link
            className="shell-logo"
            aria-label={`${model.brand.label} home page`}
            href="/"
          >
            <HeaderBrand brand={model.brand} />
          </Link>
          <HeaderNavigation navigation={model.navigation} />
        </div>
        <div className="shell-mobile-header">
          <Link
            className="shell-logo"
            aria-label={`${model.brand.label} home page`}
            href="/"
          >
            <HeaderBrand brand={model.brand} />
          </Link>
          <div className="shell-contact-icons">
            {model.contact?.phone && <a href={`tel:${model.contact.phone.replace(/[^+\d]/g, "")}`} aria-label="Call the camp"><Phone aria-hidden="true" /></a>}
            {model.contact?.email && <a href={`mailto:${model.contact.email}`} aria-label="Email the camp"><Mail aria-hidden="true" /></a>}
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="shell-drawer overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{model.brand.label}</SheetTitle>
                <SheetDescription className="sr-only">
                  Website navigation
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-6 p-4"
              >
                <div className="flex gap-5">
                  {model.contact?.phone && <a href={`tel:${model.contact.phone.replace(/[^+\d]/g, "")}`} aria-label="Call the camp"><Phone /></a>}
                  {model.contact?.email && <a href={`mailto:${model.contact.email}`} aria-label="Email the camp"><Mail /></a>}
                </div>
                <Accordion type="single" collapsible>
                  {model.navigation.items.map((item) =>
                    item.kind === "link" ? (
                      <HeaderLink
                        className="block py-3 font-semibold"
                        key={item.key}
                        link={item.link}
                        onClick={() => setOpen(false)}
                      />
                    ) : (
                      <AccordionItem value={item.key} key={item.key}>
                        <AccordionTrigger>{item.label}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {item.links.map((child) => (
                              <HeaderLink
                                className="block"
                                key={child.key}
                                link={child.link}
                                onClick={() => setOpen(false)}
                              >
                                <span className="font-medium">
                                  {child.label}
                                </span>
                                {child.description && (
                                  <span className="mt-1 block text-sm text-muted-foreground">
                                    {child.description}
                                  </span>
                                )}
                              </HeaderLink>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ),
                  )}
                </Accordion>
                {(model.topLinkColumns ?? []).map((column) => <div className="grid gap-3" key={column.key}>
                  {column.links.map((link) => <HeaderLink key={link.href} link={link} onClick={() => setOpen(false)} />)}
                </div>)}
                <div className="flex flex-col gap-3">
                  {model.navigation.actions.map((action) => (
                    <Button asChild key={action.key}>
                      <HeaderLink
                        link={action.link}
                        onClick={() => setOpen(false)}
                      />
                    </Button>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
