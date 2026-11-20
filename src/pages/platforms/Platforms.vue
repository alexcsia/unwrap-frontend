<script setup lang="ts">
import {
  usePlatforms,
  usePlatformActions,
} from "@/composables/platforms/usePlatforms";
import type { PlatformName } from "@/services/types";
import PlatformCard from "@/components/platforms/PlatformCard.vue";
import ConnectionCard from "@/components/platforms/ConnectionCard.vue";
import { usePlatformCallback } from "@/composables/platforms/usePlatformCallback";
import Navbar from "@/components/navbar/Navbar.vue";

const { get, isPending, isError } = usePlatforms();
const { connect, disconnect } = usePlatformActions();

usePlatformCallback();

const PLATFORMS: {
  name: PlatformName;
  label: string;
  description: string;
  buttonText: string;
  theme: "emerald" | "red";
}[] = [
  {
    name: "spotify",
    label: "Spotify",
    description:
      "Connect your Spotify account to start tracking your listening activity. Once connected, your new plays are automatically synced, included in your statistics, and shown on your dashboard.",
    buttonText: "Link Spotify",
    theme: "emerald",
  },
  {
    name: "lastfm",
    label: "Last.fm",
    description:
      "Connect your Last.fm account to sync your scrobbles. Once connected, your new recent tracks are automatically included in your statistics and shown on your dashboard.",
    buttonText: "Link Last.fm",
    theme: "red",
  },
];

function onDisconnect(name: PlatformName, label: string) {
  if (confirm(`Disconnect ${label}?`)) {
    disconnect.mutate(name);
  }
}
</script>

<template>
  <main class="flex min-h-screen w-full flex-col bg-neutral-950 text-white">
    <Navbar />

    <p v-if="connect.isError.value" role="alert">
      Could not start the connection.
    </p>
    <p v-if="isError" role="alert">Could not load your platforms.</p>

    <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      <template v-for="p in PLATFORMS" :key="p.name">
        <ConnectionCard
          v-if="get(p.name)"
          :label="p.label"
          :busy="disconnect.isPending.value"
          @disconnect="onDisconnect(p.name, p.label)"
        >
          <div class="mt-3 space-y-3 text-sm text-neutral-300">
            <p
              class="rounded-lg border border-white/10 bg-white/5 p-3 leading-relaxed"
            >
              Your new recent tracks from <strong>{{ p.label }}</strong> are now
              automatically tracked, included in your statistics, and displayed
              on your dashboard.
            </p>

            <details
              v-if="p.name === 'spotify'"
              class="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <summary
                class="cursor-pointer font-medium text-white select-none hover:text-emerald-400"
              >
                What is Extended Streaming History &amp; how to get it
              </summary>

              <div class="mt-3 space-y-2.5 text-neutral-300 leading-relaxed">
                <p>
                  <strong class="text-white">What it is:</strong> Connecting
                  Spotify only tracks your new plays going forward. Your
                  <strong>Extended Streaming History</strong> is an archive
                  provided by Spotify containing your complete lifetime
                  listening logs (every track, timestamp, and duration), which
                  you can upload to import your past history.
                </p>

                <div>
                  <p class="font-medium text-white mb-1">
                    How to request it from Spotify:
                  </p>
                  <ol
                    class="list-decimal list-inside space-y-1 text-neutral-300"
                  >
                    <li>
                      Open your
                      <a
                        href="https://www.spotify.com/account/privacy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-emerald-400 underline hover:text-emerald-300"
                      >
                        Spotify Account Privacy settings
                      </a>
                      and log in.
                    </li>
                    <li>
                      Scroll down to <strong>Download your data</strong> and
                      select <strong>Extended streaming history</strong>
                    </li>
                    <li>
                      Click <strong>Request data</strong> and confirm via the
                      email Spotify sends you.
                    </li>
                    <li>
                      Once Spotify emails your download link (usually within a
                      few days to a couple of weeks), download and extract the
                      ZIP archive, then upload it here
                    </li>
                    <RouterLink
                      to="/history-upload"
                      class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-surface font-bold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                      >Upload your Extended Listening History</RouterLink
                    >
                  </ol>
                </div>
              </div>
            </details>
          </div>
        </ConnectionCard>

        <div
          v-else-if="isPending"
          class="h-48 animate-pulse rounded-lg bg-neutral-800"
        />

        <PlatformCard
          v-else
          :title="p.label"
          :description="p.description"
          :button-text="p.buttonText"
          :theme="p.theme"
          @link="connect.mutate(p.name)"
        />
      </template>
    </div>
  </main>
</template>
