import { Component } from '@angular/core';
import { AventureManagerService } from 'src/services/aventure-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  inputFile;
  inputText;
  outputFileURL: string;
  outputText;

  constructor(private aventureManagerService: AventureManagerService) {

  }

  onFileChange(event){
    if (event?.target?.files?.length > 0) {
      this.inputFile = event.target.files[0];
    }
  }

  processFile() {
    if (this.inputFile) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.inputText = fileReader.result;
        this.outputText = this.aventureManagerService.getAdventureResult(this.inputText);
        const data = new Blob([this.outputText], {type: 'text/plain'});
        if (this.outputFileURL !== null) {
          window.URL.revokeObjectURL(this.outputFileURL);
        }
        this.outputFileURL = window.URL.createObjectURL(data);
      }
      fileReader.readAsText(this.inputFile);
    }
  }

  downloadFile() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = this.outputFileURL;
    link.download = 'output.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
