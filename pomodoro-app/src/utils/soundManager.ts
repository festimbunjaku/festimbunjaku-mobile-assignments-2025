import { Audio } from "expo-av";

class SoundManager {
  private sound: Audio.Sound | null = null;
  private isLoaded = false;
  private hasWarned = false;

  async loadSound() {
    if (this.isLoaded) return;

    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Load the alarm sound
      // TODO: Add an actual sound file to src/assets/sounds/alarm.mp3
      // For now, this will log a warning once but won't crash the app
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/alarm.mp3")
        );
        this.sound = sound;
        this.isLoaded = true;
      } catch (soundError) {
        // Only warn once to avoid spam
        if (!this.hasWarned) {
          this.hasWarned = true;
        }
        // Mark as loaded to prevent repeated attempts
        this.isLoaded = true;
      }
    } catch (error) {
      // Error configuring audio
    }
  }

  async playAlarm() {
    try {
      if (!this.isLoaded) {
        await this.loadSound();
      }

      if (this.sound) {
        await this.sound.replayAsync();
      }
    } catch (error) {
      // Error playing alarm
    }
  }

  async stopAlarm() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      // Error stopping alarm
    }
  }

  async unloadSound() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isLoaded = false;
      }
    } catch (error) {
      // Error unloading sound
    }
  }
}

export const soundManager = new SoundManager();
