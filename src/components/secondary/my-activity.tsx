"use client"

import * as React from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Confirmation from "@/components/block/confirmation"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dropdown } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LoginHistoryCard, LoginHistoryEntry } from "./login-history-card"

export interface Session {
  id: string
  device: string
  os: string
  location: string
  date: string
  isCurrent: boolean
}

export interface Project {
  id: string
  name: string
}

export interface MyActivityProps {
  lastLogin: string
  sessions: Session[]
  projects: Project[]
  onLogoutSession?: (id: string) => void
  onLogoutAll?: () => void
  onExportActivity?: () => void
  onSelectProject?: (projectId: string) => void
  onDeleteAccount?: () => void
  loginHistory?: LoginHistoryEntry[]
  className?: string
}

export function MyActivity({
  lastLogin,
  sessions,
  projects,
  onLogoutSession,
  onLogoutAll,
  onExportActivity,
  onSelectProject,
  onDeleteAccount,
  loginHistory = [],
  className,
}: MyActivityProps) {
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = React.useState(false)
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = React.useState(false)
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const [showExportProjectConfirm, setShowExportProjectConfirm] = React.useState(false)
  const [pendingProjectId, setPendingProjectId] = React.useState<string | null>(null)
  const [showLoginHistory, setShowLoginHistory] = React.useState(false)
  
  return (
    <div className={`bg-color-surface-neutral-default ${cn("w-full flex flex-col gap-6 pb-12", className)}`}>
      {/* Login History Section */}
      <section className="flex flex-col gap-4">
        <h2 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Login history</h2>
        <div className="border-b border-color-border-neutral-default h-px " />
      </section>
      <section>
        <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
          Last login : {lastLogin}
        </p>
      </section>

      {/* Active Sessions Section */}
      <section className="w-full flex flex-col gap-8 ">
        <div className="flex flex-col w-full gap-2">
          <h3 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Active sessions</h3>
          <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-tertiary ">
            You have {sessions.length} active sessions. Sessions older than 30 days are automatically terminated.
            <button 
              onClick={() => setShowLoginHistory(true)}
              className="text-style-textblock-primary-caption-regular text-color-text-feedback-info-default hover:underline cursor-pointer ml-1"
            >
              See login history
            </button>
          </p>
        </div>

        <div className="flex flex-col">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-4 py-4 border-b border-color-border-neutral-default first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 flex items-center justify-center">
                  {session.os.toLowerCase().includes("android") || session.os.toLowerCase().includes("ios") ? (
                    <Image src='/android.svg' alt="Android" width={17.92} height={26.88} />
                  ) : (
                    <Image src='/desktop.svg' alt="Desktop" width={34.56} height={27.05} />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                      {session.device}
                    </span>
                    {session.isCurrent && (
                      <Label size="small" colorScheme="primary">
                        Current
                      </Label>
                    )}
                  </div>
                  <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
                    {session.location} • {session.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLogoutSession?.(session.id)}
                className="p-1 text-style-body-default-emphasis text-color-text-feedback-info-default hover:underline cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ))}
        </div>

        <Confirmation
          open={showLogoutAllConfirm}
          onOpenChange={setShowLogoutAllConfirm}
          mainText="Logout from all devices"
          subText="Are you sure you want to logout from all of your active sessions?"
          confirmText="Logout all"
          onConfirmClick={() => {
            onLogoutAll?.()
            setShowLogoutAllConfirm(false)
          }}
          onCancelClick={() => setShowLogoutAllConfirm(false)}
        >
          <Button
            variant="neutral"
            size="extraSmall"
            className="w-fit"
          >
            Logout of all devices
          </Button>
        </Confirmation>

        <Dialog open={showLoginHistory} onOpenChange={setShowLoginHistory}>
          <DialogContent className="p-0 border-none bg-transparent shadow-none w-auto max-w-fit" showCloseButton={false}>
            <DialogTitle className="sr-only">Login History</DialogTitle>
            <LoginHistoryCard logins={loginHistory} onClose={() => setShowLoginHistory(false)} />
          </DialogContent>
        </Dialog>
      </section>

      {/* Export Section */}
      <section className="flex flex-col gap-4 pt-6">
        <h2 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Export</h2>
        <div className="flex flex-col border-t border-color-border-neutral-default pt-6 gap-4">
          {/* Activity History Export */}
          <div className="p-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12">
            <div className="flex flex-col">
              <h4 className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">Activity History</h4>
              <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-tertiary w-full">
                Detailed logs of your every data and action spanning across all of your projects.
              </p>
            </div>
            <Button variant="neutral" size="extraSmall" onClick={onExportActivity}>
              Export activity logs
            </Button>
          </div>

          {/* Project Logs Export */}
          <div className="p-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12">
            <div className="flex flex-col">
              <h4 className="t-1 text-style-body-default-emphasis text-color-text-neutral-default">Project logs</h4>
              <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-tertiary w-full">
                Export data and logs of any specific project.
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="neutral" size="extraSmall" suffixIcon="arrow-down-c">
                  {selectedProject ? selectedProject.name : "Select a project"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none bg-transparent shadow-none w-auto" align="end">
                <Dropdown
                  options={projects.map((project) => ({
                    value: project.id,
                    title: project.name,
                  }))}
                  value={selectedProjectId}
                  onChange={(value) => {
                    setPendingProjectId(value)
                    setShowExportProjectConfirm(true)
                  }}
                  searchbar="off"
                  className="w-[180px]"
                />
              </PopoverContent>
            </Popover>
            <Confirmation
              open={showExportProjectConfirm}
              onOpenChange={setShowExportProjectConfirm}
              mainText="Export activity logs"
              subText="Are you sure you want to export your activity logs? You will receive them on your registered email address within 24 hours."
              confirmText="Proceed"
              cancelText="Discard"
              onConfirmClick={() => {
                if (pendingProjectId) {
                  setSelectedProjectId(pendingProjectId)
                  onSelectProject?.(pendingProjectId)
                }
                setShowExportProjectConfirm(false)
              }}
              onCancelClick={() => setShowExportProjectConfirm(false)}
            />
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="flex flex-col gap-4 pt-6 pb-22">
        <h2 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Danger zone</h2>
        <div className="p-2 flex flex-col border-t border-color-border-neutral-default pt-8 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h4 className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">Delete account</h4>
              <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-tertiary w-full">
                Permanently delete this account, including files, notes and research sessions.
              </p>
            </div>
            <Confirmation
              open={showDeleteAccountConfirm}
              onOpenChange={setShowDeleteAccountConfirm}
              mainText="Delete Account"
              subText="Are you sure you want to permanently delete your account? This action cannot be undone."
              confirmVariant="destructive"
              confirmText="Delete Account"
              onConfirmClick={() => {
                onDeleteAccount?.()
                setShowDeleteAccountConfirm(false)
              }}
              onCancelClick={() => setShowDeleteAccountConfirm(false)}
            >
              <Button variant="destructive" size="extraSmall">
                Delete
              </Button>
            </Confirmation>
          </div>
          <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-tertiary">
            You can still recover your account within 30 days by writing an email to contact@judix.in
          </p>
        </div>
      </section>
    </div>
  )
}
