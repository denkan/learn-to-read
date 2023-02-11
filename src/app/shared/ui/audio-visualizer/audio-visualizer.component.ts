import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-visualizer',
  template: `<canvas #c auto-size class="full-fill"></canvas>`,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class AudioVisualizerComponent {
  @Input() set audioData(value: Uint8Array | null) {
    if (value) {
      this.render(value);
    }
  }

  @ViewChild('c') canvasRef?: ElementRef<HTMLCanvasElement>;

  render(data: Uint8Array) {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const sliceWidth = (WIDTH * 1.0) / data.length;

    // ctx.fillStyle = '#FFF';
    // ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#888';
    ctx.beginPath();

    let x = 0;
    for (var i = 0; i < data.length; i++) {
      var v = data[i] / 128.0;
      var y = (v * HEIGHT) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x = i * sliceWidth; //frequencyBins/analyser.sampleRate;
    }
    ctx.lineTo(WIDTH, ((data[0] / 128.0) * HEIGHT) / 2);
    ctx.stroke();
  }
}
