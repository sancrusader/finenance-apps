"use client"

import React from "react"
import {
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { TeamSwitcher } from "./TeamSwitch"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"

export function AppSidebar(props) {
  const { props: { auth: { user } } } = usePage();
  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Home",
        logo: GalleryVerticalEnd,
        plan: "Finance",
      },
    ],
    navMain: [
      {
        title: "Aksa Bumi Langit",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Nota",
            url: route('dashboard'),
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Kun",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Upload Nota",
            url: route('kun.index'),
          },
          {
            title: "List",
            url: route('kun.nota'),
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}