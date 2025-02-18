import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getDocumentScanner, getLocationService } from "lightning/mobileCapabilities"; // Import Scanner & Geoocation Module
import { createRecord } from 'lightning/uiRecordApi';

export default class CaptureImage extends LightningElement {
    @api recordId;  //record Id

    locationDetected = '';  
    serviceError = '';  

    myLocationService;  // holds the location service object
    currentLocation;    // holds the current location data (latitude, longitude)

    @track capturedImage;   // stores captured Image Data
    @track imageError;
    @track captureDisabled = true;


    // When Component is initialized, check location availability
    connectedCallback() {
        console.log('recordId--> ', this.recordId);
        this.myLocationService = getLocationService();
        if (this.myLocationService == null || !this.myLocationService.isAvailable()) {
            this.serviceError = 'We can\'t locate you. Please enable location access on your device.. ';
            this.showToast('Location Service Is Not Available', this.serviceError , 'error');
        }else{
            this.captureDisabled = false;
            this.fetchLocation();
        }
    }


    // fetch current position using the location service
    fetchLocation() {
        this.currentLocation = null; // Reset current location data
        const locationOptions = { enableHighAccuracy: true }  // Configure options for location request
        
        // Make the request 
        this.myLocationService
            .getCurrentPosition(locationOptions)
            .then((result)  => {
                this.currentLocation = result;  // result is a Location object
                this.locationDetected = 'Your Location Detected! Capture using this button below..';
                this.showToast('Location Detected', this.locationDetected, 'success');
            })
            .catch((error) => {
                console.log(error);
                this.showToast('LocationService Error', 'We can\'t locate you. Please enable location access on your device.. ', 'error');
            })
            .finally(() => {
                console.log('finally block');
            });
    } 
    

    // Reset the data 
    resetCapturedImg() {
        this.capturedImage = null;
        this.imageError = null;
    }


    // Take Picture handler
    handleTakePicture(){
        this.processImage("DEVICE_CAMERA");  
    }


    processImage(imageSource) {
        this.resetCapturedImg(); 
        const myImage = getDocumentScanner(); 

        if (myImage.isAvailable()) {
            const options = { imageSource: imageSource, returnImageBytes: true, }; // Configure the scan
    
            myImage
                .scan(options)
                .then((results) => {
                    this.processCapturedImage(results);
                })
                .catch((error) => {
                    this.imageError = "Error code: " + error.code + "\nError message: " + error.message;
                });
        } else {
            this.imageError = "Problem initiating scan. Please use mobile device..";
        }
    }


    processCapturedImage(results) {
        if (results.length) {
            //this.capturedImage = results[0];
            let image = results[0];
            this.addLocationToImage(image);
            
        }
    }


    addLocationToImage(image) {
        const img = new Image();
        img.src = image.imageBytes;
        
        // get Latitude & Longitude from currentLocation
        const latitude = this.currentLocation.coords.latitude;
        const longitude = this.currentLocation.coords.longitude;
        const geolocation = latitude + ', ' + longitude;   // Add the user's location to the image

        img.onload = () => {
            const canvas = document.createElement('canvas');    // Create a canvas to overlay location data
            const ctx = canvas.getContext('2d');
            const maxWidth = 800;
            const ratio = img.width / img.height;

            if (img.width > maxWidth) {
                canvas.width = maxWidth;
                canvas.height = maxWidth / ratio;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw the image onto the canvas
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(geolocation, canvas.width - 20, canvas.height - 20);  // Position the text at the bottom right with a 20px margin
            
            const modifiedImage = canvas.toDataURL('image/jpeg');   // get the modified image as base64
            this.capturedImage = { imageBytes: modifiedImage }; // captured image with the new base64 image
        };
    } 
    

    // Upload Image handler
    async handleImageUpload() {
        // Ensure an image was captured
        if (!this.capturedImage) {
            this.showToast('Error', 'No image captured to upload.', 'error');
            return;
        }

        const imageBytes = this.capturedImage.imageBytes;
        const fileName = 'CapturedImage.png';  // Set the desired file name
        const recId = this.recordId;
        
        // Create ContentVersion record 
        const contentVersion = { Title: fileName,
                                 PathOnClient: fileName,
                                 VersionData: imageBytes.split(',')[1],
                                 FirstPublishLocationId: recId};
        try{
            // Create the record
            const result = await createRecord({ apiName: 'ContentVersion', fields: contentVersion });
            this.resetCapturedImg();
            this.showToast('Success', 'Image uploaded successfully!', 'success');
        } catch (error) {
            this.showToast('Error', 'Failed to upload image: ' + error.body.message, 'error');
        }
    }


    // Show Toast Notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
  
}