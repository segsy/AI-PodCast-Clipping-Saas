import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";

import { api } from "../lib/api";
import { useTheme } from "../lib/theme";
import { getCurrentWorkspaceId, resolveWorkspaceSelection, setCurrentWorkspaceId } from "../lib/workspace";
import type { Workspace } from "../types/api";

type Props = {
  onChanged?: () => Promise<void> | void;
};

export function WorkspaceSwitcher({ onChanged }: Props) {
  const { primary, setPrimary } = useTheme();

  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceTheme, setNewWorkspaceTheme] = useState("#6366f1");
  const [newWorkspaceAvatar, setNewWorkspaceAvatar] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");

  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editThemeColor, setEditThemeColor] = useState("#6366f1");

  const load = useCallback(async () => {
    const stored = await getCurrentWorkspaceId();
    const res = await api.get<{ workspaces: Workspace[]; defaultWorkspaceId: string | null }>("/api/workspaces");
    const rows = res.workspaces || [];
    setWorkspaces(rows);

    const selected = await resolveWorkspaceSelection(rows, res.defaultWorkspaceId ?? null);
    setCurrentId(selected ?? stored ?? null);

    const selectedWs = rows.find((w) => w.id === (selected ?? stored));
    if (selectedWs?.themeColor) setPrimary(selectedWs.themeColor);
  }, [setPrimary]);

  useEffect(() => {
    load();
  }, [load]);

  const current = useMemo(() => workspaces.find((w) => w.id === currentId), [workspaces, currentId]);
  const canCreate = useMemo(() => workspaces.length === 0 || workspaces.some((w) => w.role === "owner"), [workspaces]);
  const canManageCurrent = current?.role === "owner" || current?.role === "admin";

  useEffect(() => {
    setEditName(current?.name ?? "");
    setEditAvatar(current?.avatar ?? "");
    setEditThemeColor(current?.themeColor ?? "#6366f1");
  }, [current]);

  async function selectWorkspace(workspaceId: string) {
    await setCurrentWorkspaceId(workspaceId);
    setCurrentId(workspaceId);
    const selected = workspaces.find((w) => w.id === workspaceId);
    if (selected?.themeColor) setPrimary(selected.themeColor);
    setOpen(false);
    await onChanged?.();
  }

  async function createWorkspaceHandler() {
    if (!newWorkspaceName.trim() || !canCreate) return;
    const created = await api.post<{ workspace: Workspace }>("/api/workspaces", {
      name: newWorkspaceName.trim(),
      themeColor: newWorkspaceTheme.trim(),
      avatar: newWorkspaceAvatar.trim()
    });
    setNewWorkspaceName("");
    setNewWorkspaceTheme("#6366f1");
    setNewWorkspaceAvatar("");
    await setCurrentWorkspaceId(created.workspace.id);
    setCurrentId(created.workspace.id);
    setPrimary(created.workspace.themeColor);
    await load();
    await onChanged?.();
  }

  async function inviteMemberHandler() {
    if (!currentId || !inviteEmail.trim() || !canManageCurrent) return;
    await api.post<{ ok: boolean }>(`/api/workspaces/${currentId}/invite`, {
      email: inviteEmail.trim(),
      role: inviteRole
    });
    setInviteEmail("");
  }

  async function saveBrandingHandler() {
    if (!currentId || !canManageCurrent) return;
    await api.patch(`/api/workspaces/${currentId}`, {
      name: editName.trim(),
      avatar: editAvatar.trim(),
      themeColor: editThemeColor.trim()
    });
    setPrimary(editThemeColor.trim() || primary);
    await load();
    await onChanged?.();
  }

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: "#d4d4d8"
        }}
      >
        <Text style={{ fontWeight: "600" }}>{current?.name ?? "Select workspace"}</Text>
        <Text style={{ fontSize: 12, opacity: 0.7 }}>{current?.role ?? ""}</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Switch workspace</Text>

          <FlatList
            data={workspaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => selectWorkspace(item.id)}
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderRadius: 12,
                  marginBottom: 10,
                  borderColor: "#d4d4d8",
                  backgroundColor: item.id === currentId ? "#f4f4f5" : "transparent"
                }}
              >
                <Text style={{ fontWeight: "600" }}>{item.avatar} · {item.name}</Text>
                <Text style={{ fontSize: 12, opacity: 0.7 }}>{item.role} · {item.themeColor}</Text>
              </Pressable>
            )}
          />

          {canCreate ? (
            <>
              <TextInput
                value={newWorkspaceName}
                onChangeText={setNewWorkspaceName}
                placeholder="New workspace name"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <TextInput
                value={newWorkspaceAvatar}
                onChangeText={setNewWorkspaceAvatar}
                placeholder="Avatar (e.g. AP)"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <TextInput
                value={newWorkspaceTheme}
                onChangeText={setNewWorkspaceTheme}
                placeholder="Theme color (e.g. #6366f1)"
                autoCapitalize="none"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <Pressable onPress={createWorkspaceHandler} style={{ borderRadius: 10, padding: 10, backgroundColor: "#111" }}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Create workspace</Text>
              </Pressable>
            </>
          ) : (
            <Text style={{ color: "#71717a" }}>Only owners can create workspaces.</Text>
          )}

          {canManageCurrent ? (
            <>
              <Text style={{ fontWeight: "700" }}>Workspace branding</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Workspace name"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <TextInput
                value={editAvatar}
                onChangeText={setEditAvatar}
                placeholder="Avatar"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <TextInput
                value={editThemeColor}
                onChangeText={setEditThemeColor}
                placeholder="Theme color"
                autoCapitalize="none"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <Pressable onPress={saveBrandingHandler} style={{ borderRadius: 10, padding: 10, backgroundColor: primary }}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Save branding</Text>
              </Pressable>

              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="Invite member email"
                autoCapitalize="none"
                style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
              />
              <View style={{ flexDirection: "row", gap: 10 }}>
                {(["admin", "editor", "viewer"] as const).map((role) => (
                  <Pressable
                    key={role}
                    onPress={() => setInviteRole(role)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                      borderColor: inviteRole === role ? primary : "#d4d4d8"
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>{role}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={inviteMemberHandler} style={{ borderRadius: 10, padding: 10, backgroundColor: "#0f766e" }}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Invite member</Text>
              </Pressable>
            </>
          ) : null}

          <Pressable onPress={() => setOpen(false)} style={{ padding: 12 }}>
            <Text style={{ color: primary }}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
