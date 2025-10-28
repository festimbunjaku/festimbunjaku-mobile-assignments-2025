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
          console.warn(
            "Alarm sound file not found. Please add alarm.mp3 to src/assets/sounds/"
          );
          this.hasWarned = true;
        }
        // Mark as loaded to prevent repeated attempts
        this.isLoaded = true;
      }
    } catch (error) {
      console.error("Error configuring audio:", error);
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
      console.error("Error playing alarm:", error);
    }
  }

  async stopAlarm() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      console.error("Error stopping alarm:", error);
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
      console.error("Error unloading sound:", error);
    }
  }
}

export const soundManager = new SoundManager();
