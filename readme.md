# Appxi Driver

Aplicación para conductores de la plataforma Appxi.

## Installación

Para instalar la aplicación se deben ejecutar los siguientes comandos:
```bash
npm i
react-native run-android
or
react-native run-ios
```
Para publicar tu App en la Playstore debes seguir los siguientes pasos en la documentación de [ReactNative](https://reactnative.dev/docs/signed-apk-android), para lo cual previamente debes cambiar el nombre del paquete de la App con el siguiente comando:
```bash
react-native-rename "New Name" -b com.company.newname
```
Importante: Una vez cambiaste el nombre del paquete de la App debes registrar tu App en [Firebase](https://console.firebase.google.com) para poder usar la autenticación mediante SMS, de lo contrario no funcionará debido a que el nuevo nombre del paquete de tu App no coincidirá con el nombre registrado en el archivo ./android/app/google-services.json (com.loginweb.deliveryapp), y eso te generará un error al volver a siscronizar tu app.
En dicha documentación te muestran cómo vincular tu App a firebase y generar el nuevo archivo google-services.json con los nuevos datos de tu App que reemplazaras por el archivo que viene por defecto.

<!-- ## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/) -->