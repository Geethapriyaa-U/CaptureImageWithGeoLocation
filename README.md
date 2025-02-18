# Capture Image With Geolocation

This component enables mobile users to capture an image along with their current geolocation (latitude and longitude) and upload it to a Salesforce record. The component is designed to use on Salesforce mobile app, providing an intuitive way to capture photos and associate them with Salesforce records.

## Features
- **Mobile Optimized**: Fully Compatible with Salesforce mobile app
- **Geolocation Capture**: Automatically captures technician's current location (latitude & longitude)
- **Image Capture**: Allows users to take photo using their mobile device's camera.
- **Paste Location data:** Draw the location data using canvas element in the captured image
- **Record Association**: Uploads the image with geolocation information to a specified Salesforce record. (Work Order or Service Appointments)

## How to Configuration?
### Prerequisite
Before deploying this LWC component to your Salesforce environment, ensure the following prerequisites are met:

- **1. Field Service Setup:**  Ensure that Field Service has been installed and configured in your Salesforce environment. Verify that necessary permissions are granted to the resources to view the records and access Field Service objects such as Work Orders, and Service Appointments
  
- **2. Enable Lightning SDK for Field Service Mobile:** The Lightning SDK for Field Service Mobile must be enabled to access mobile capabilities like location services and camera access. 
To enable it:
   - Go to **Setup** in Salesforce
   - Search **Field Service Settings** in Quick Find
   - Enable **Lightning SDK for Field Service Mobile**

- **3. Deploy the Component:** Authorize & Deploy the Component to the target Org.

- **4. Create Quick Action button:** Create a Quick Action button in Work Order and add it to the page layout


## Demonstration
  1. Open Field Service Mobile App and select the Scheduled Service Appointment. Under Work Order Actions, click the Capture Image Button
 ![Media (4)](https://github.com/user-attachments/assets/86970c0d-6aea-46a1-ac38-f0ca5c63ac33) 

  2. The technician's current location will be automatically detected and the Take Picture button will be enable. If location is not enable in the mobile device an Error Toast Message will popup.
![Media (2)](https://github.com/user-attachments/assets/87ebac3c-823a-4128-a2fd-1e31fd8c940a)

  3. Capture the Image and Upload the Image with the geolocation marked in the captured image.
![Media (3)](https://github.com/user-attachments/assets/d1b71cb2-1383-46b9-a875-f68afc3ac4ef)

  4. The captured image can be tracked in the Related List of the specified Salesforce record.
![Screenshot 2025-02-18 180932](https://github.com/user-attachments/assets/f5fcd48d-dbc8-4536-bd16-04750e0a1d71)

## Key Use Case
- For use cases like inspection reports, damage assessments, or product documentation, where both images and their associated geolocation (latitude, longitude) need to be stored and linked to Salesforce records.

## Future Enhancements
- **Support for Multiple Images**: Enable users to capture and upload multiple images per record.
- **Allow Annotations**: Add functionality to allow mobile users to annotate images before uploading them.


  
