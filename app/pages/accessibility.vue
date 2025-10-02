<template>
    <div class="min-h-screen bg-secondary-50 p-6">
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <h1 class="text-2xl font-bold text-primary-700 mb-6">
                Accessibility Settings
            </h1>

            <form @submit.prevent="saveSettings" class="space-y-8">
                <!-- TTS Settings -->
                <section>
                    <h2 class="text-lg font-semibold text-primary-600 mb-2">
                        Text-to-Speech (TTS)
                    </h2>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.tts_enabled" type="checkbox" class="form-checkbox" />
                        <span>Enable TTS</span>
                    </label>
                    <div v-if="settings.tts_enabled" class="mt-3 space-y-3">
                        <div>
                            <label class="block text-sm font-medium">Voice</label>
                            <input v-model="settings.tts_voice" type="text" class="input-field" placeholder="default" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Speed</label>
                            <input v-model.number="settings.tts_speed" type="number" step="0.1" min="0.5" max="2"
                                class="input-field" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Volume</label>
                            <input v-model.number="settings.tts_volume" type="number" step="0.1" min="0" max="2"
                                class="input-field" />
                        </div>
                    </div>
                </section>

                <!-- STT Settings -->
                <section>
                    <h2 class="text-lg font-semibold text-primary-600 mb-2">
                        Speech-to-Text (STT)
                    </h2>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.stt_enabled" type="checkbox" class="form-checkbox" />
                        <span>Enable STT</span>
                    </label>
                    <div v-if="settings.stt_enabled" class="mt-3 space-y-3">
                        <div>
                            <label class="block text-sm font-medium">Language</label>
                            <input v-model="settings.stt_language" type="text" class="input-field"
                                placeholder="en-US" />
                        </div>
                        <label class="flex items-center space-x-3">
                            <input v-model="settings.stt_auto_punctuation" type="checkbox" class="form-checkbox" />
                            <span>Auto punctuation</span>
                        </label>
                    </div>
                </section>

                <!-- Visual Settings -->
                <section>
                    <h2 class="text-lg font-semibold text-primary-600 mb-2">
                        Visual Settings
                    </h2>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.high_contrast_mode" type="checkbox" class="form-checkbox" />
                        <span>High contrast mode</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.large_text_mode" type="checkbox" class="form-checkbox" />
                        <span>Large text mode</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.reduced_motion" type="checkbox" class="form-checkbox" />
                        <span>Reduced motion</span>
                    </label>
                </section>

                <!-- Navigation -->
                <section>
                    <h2 class="text-lg font-semibold text-primary-600 mb-2">
                        Navigation
                    </h2>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.keyboard_navigation_hints" type="checkbox" class="form-checkbox" />
                        <span>Keyboard navigation hints</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.screen_reader_optimized" type="checkbox" class="form-checkbox" />
                        <span>Screen reader optimization</span>
                    </label>
                </section>

                <!-- Notifications -->
                <section>
                    <h2 class="text-lg font-semibold text-primary-600 mb-2">
                        Notifications
                    </h2>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.audio_notifications" type="checkbox" class="form-checkbox" />
                        <span>Audio notifications</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input v-model="settings.visual_notifications" type="checkbox" class="form-checkbox" />
                        <span>Visual notifications</span>
                    </label>
                </section>

                <!-- Save -->
                <div class="pt-4">
                    <button type="submit"
                        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const settings = ref<any>({
    tts_enabled: false,
    tts_voice: "default",
    tts_speed: 1.0,
    tts_volume: 1.0,
    stt_enabled: false,
    stt_language: "en-US",
    stt_auto_punctuation: true,
    high_contrast_mode: false,
    large_text_mode: false,
    reduced_motion: false,
    keyboard_navigation_hints: true,
    screen_reader_optimized: false,
    audio_notifications: true,
    visual_notifications: true,
});

onMounted(async () => {
    if (!user.value) return;
    const { data } = await supabase
        .from("accessibility_settings")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

    if (data) settings.value = { ...settings.value, ...data };
});

const saveSettings = async () => {
    if (!user.value) return;
    const { error } = await supabase.from("accessibility_settings").upsert({
        user_id: user.value.id,
        ...settings.value,
        updated_at: new Date().toISOString(),
    });
    if (error) alert("Error saving settings: " + error.message);
    else alert("Settings saved successfully!");
};
</script>

<style scoped>
.input-field {
    @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500;
}
</style>
