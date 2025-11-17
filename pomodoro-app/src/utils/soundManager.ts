import { createAudioPlayer, AudioPlayer } from "expo-audio";

class SoundManager {
  private player: AudioPlayer | null = null;
  private isLoaded = false;
  private hasWarned = false;

  async loadSound() {
    if (this.isLoaded && this.player) return;

    try {
      // Create audio player and load the alarm sound
      try {
        const source = require("../assets/sounds/alarm.mp3");
        this.player = createAudioPlayer(source);
        // Wait a bit for the player to load
        await new Promise((resolve) => setTimeout(resolve, 100));
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
      if (!this.isLoaded || !this.player) {
        await this.loadSound();
      }

      if (this.player) {
        // If already playing, seek to start and play again
        if (this.player.playing) {
          await this.player.seekTo(0);
          this.player.play();
        } else {
          // Seek to start in case it was paused mid-playback
          await this.player.seekTo(0);
          this.player.play();
        }
      }
    } catch (error) {
      console.error("Error playing alarm:", error);
      // Optionally: Send to error tracking service
    }
  }

  async stopAlarm() {
    try {
      if (this.player) {
        this.player.pause();
        await this.player.seekTo(0);
      }
    } catch (error) {
      console.error("Error stopping alarm:", error);
      // Optionally: Send to error tracking service
    }
  }

  async unloadSound() {
    try {
      if (this.player) {
        this.player.remove();
        this.player = null;
        this.isLoaded = false;
      }
    } catch (error) {
      console.error("Error unloading sound:", error);
      // Optionally: Send to error tracking service
    }
  }

  // Reset method for testing - allows tests to reset internal state
  reset() {
    this.player = null;
    this.isLoaded = false;
    this.hasWarned = false;
  }
}

export const soundManager = new SoundManager();
