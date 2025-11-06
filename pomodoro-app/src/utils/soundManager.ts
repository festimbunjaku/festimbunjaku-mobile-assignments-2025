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
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/alarm.mp3")
        );
        this.sound = sound;
        this.isLoaded = true;
      } catch (soundError) {
        // Only warn once to avoid spam
        if (!this.hasWarned) {
          console.error("Error loading alarm sound:", soundError);
          this.hasWarned = true;
        }
        // Mark as loaded to prevent repeated attempts
        this.isLoaded = true;
      }
    } catch (error) {
      console.error("Error configuring audio:", error);
      // Optionally: Send to error tracking service
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
      // Optionally: Send to error tracking service
    }
  }

  async stopAlarm() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      console.error("Error stopping alarm:", error);
      // Optionally: Send to error tracking service
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
      // Optionally: Send to error tracking service
    }
  }

  // Reset method for testing - allows tests to reset internal state
  reset() {
    this.sound = null;
    this.isLoaded = false;
    this.hasWarned = false;
  }
}

export const soundManager = new SoundManager();
