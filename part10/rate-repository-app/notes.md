- Instalar expo-cli (local, no global)

## Metro == Webpack

- Al ejecutar el script npm start se inicia el paquete de Metro, que es un paquete de JavaScript para React Native. Puede describirse como el Webpack del ecosistema React Native.

## Elementos de React Native

- El componente `Texto` es el único componente de React Native que puede tener hijos textuales. Es similar, por ejemplo, a los elementos <strong> y <h1>.
- El componente `View` es el componente básico de la interfaz de usuario similar al <div>
- El componente `TextInput` es un componente de campo de texto similar al elemento <input>.
- El componente `TouchableWithoutFeedback` (y otros componentes Touchable\*) sirve para capturar diferentes eventos de prensa. Es similar, por ejemplo, al elemento <button>.

- Observacion: La primera diferencia es que el componente Text es el único componente React Native que puede tener hijos textuales. Esto significa que no puede, por ejemplo, reemplazar el componente Text con el View

- React Native proporciona un componente útil para mostrar una lista de datos, que es el componente `FlatList`.

### Cheatsheet de estilos de React Native

- https://github.com/vhpoet/react-native-styling-cheat-sheet

## UI Coherente

Debido a que React Native no admite estilos globales, deberíamos crear nuestro propio componente Text para mantener la coherencia del contenido textual. Comencemos agregando el siguiente objeto de configuración de tema en un archivo theme.js en el directorio src:

```js
const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: "System",
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
};

export default theme;
```

### flex-grow

Si todos los elementos flexibles tienen un flexGrow de 1, compartirán todo el espacio disponible de manera uniforme. Si un elemento flexible tiene un flexGrow de 0, solo usará el espacio que requiere su contenido y dejará el resto del espacio para otros elementos flexibles.

## flex en react native

React Native y CSS tienen algunas diferencias con respecto al flexbox. La diferencia más importante es que en React Native el valor predeterminado para la propiedad `flexDirection es column`. También vale la pena señalar que `la abreviatura flex no acepta múltiples valores en React Native`.

- Leer mas aca: https://reactnative.dev/docs/flexbox

## Routing

Con React Native podemos usar todo el núcleo del enrutador React, incluidos los ganchos y componentes. La única diferencia con el entorno del navegador es que debemos reemplazar el BrowserRouter con NativeRouter compatible con React Native , proporcionado por la biblioteca react-router-native. Comencemos instalando la librería react-router-native:

```bash
npm install react-router-native
```

El uso de la librería react-router-native romperá la vista previa del navegador web de Expo. Sin embargo, otras vistas previas funcionarán igual que antes. Podemos solucionar el problema ampliando la configuración del Webpack de la Expo para que transpile las fuentes de la biblioteca react-router-native con Babel. Para extender la configuración de Webpack, necesitamos instalar la librería @expo/webpack-config:

```bash
npm install @expo/webpack-config --save-dev
```

A continuación, cree un archivo webpack.config.js en el directorio raíz de su proyecto

## Formularios

Los conceptos principales de `Formik` son el contexto y un campo. El contexto de Formik lo proporciona el componente Formik que contiene el estado del formulario. El estado consta de información de los campos del formulario. Esta información incluye, por ejemplo, el valor y los errores de validación de cada campo. Se puede hacer referencia a los campos del estado por su nombre utilizando el hook useField o el componente Field.

El hook useField tiene un argumento que es el nombre del campo y devuelve una matriz con tres valores, [field, meta, helpers]. El objeto de campo contiene el valor del campo, el metaobjeto contiene metainformación del campo, como un posible mensaje de error y el objeto de ayuda contiene diferentes acciones para cambiar el estado del campo, como la función setValue. Tenga en cuenta que el componente que usa el hook useField tiene que estar dentro del contexto de Formik. Esto significa que el componente debe ser descendiente del componente Formik.

```bash
npm install formik
```

Recuerde utilizar el componente FormikTextInput que implementamos anteriormente. Puede utilizar el prop secureTextEntry en el componente TextInput para ocultar la entrada de la contraseña.

## Render props pattern

- Para renderizar el form se utiliza un render prop pattenr

```js
const SignInForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <FormikTextInput
        name="username"
        placeholder="Username"
        style={styles.input}
      ></FormikTextInput>

      <FormikTextInput
        name="password"
        placeholder="password"
        secureTextEntry
        style={styles.input}
      ></FormikTextInput>

      <TouchableWithoutFeedback onPress={onSubmit}>
        <Text style={styles.submitButton}>Sign in</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const SignIn = () => {
  const onSubmit = (values) => {
    console.log("Values: ", values);
  };
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit}></SignInForm>}
    </Formik>
  );
};
```

## Validacion

Validación del formulario
Formik ofrece dos enfoques para la validación de formularios: una función de validación o un esquema de validación. Una función de validación es una función proporcionada para el componente Formik como el valor del prop validate. Recibe los valores del formulario como argumento y devuelve un objeto que contiene posibles mensajes de error específicos del campo.

El segundo enfoque es el esquema de validación que se proporciona para el componente Formik como el valor del prop validationSchema. Este esquema de validación se puede crear con una librería de validación llamada Yup

```bash
npm install yup
```

Si la validación falla, no se llama a la función provista para la propiedad onSubmit del componente Formik.

## Patron de estilos

- Se puede crear una especie de "agregador" de estilos con el siguiente patron:

```js
import React from "react";
import { TextInput as NativeTextInput, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  error: {
    borderColor: "#d73a4a",
  },
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style];

  if (error) {
    textInputStyle.push(styles.error);
  }

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
```

## Plataforma

Podemos acceder a la plataforma del usuario a través de la constante Platform.OS:

```js
import { React } from "react";
import { Platform, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === "android" ? "green" : "blue",
  },
});

const WhatIsMyPlatform = () => {
  return <Text style={styles.text}>Your platform is: {Platform.OS}</Text>;
};
```

- O con platform.select

```js
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: "green",
      ios: "blue",
      default: "black",
    }),
  },
});
```

```js
const MyComponent = Platform.select({
  ios: () => require("./MyIOSComponent"),
  android: () => require("./MyAndroidComponent"),
})();

<MyComponent />;
```

Sin embargo, un método más sofisticado para implementar e importar componentes específicos de la plataforma (o cualquier otro fragmento de código) es utilizar las extensiones de archivo .io.jsx y .android.jsx. Tenga en cuenta que la extensión .jsx también puede ser cualquier extensión reconocida por el paquete, como .js. Por ejemplo, podemos tener archivos Button.ios.jsx que podemos importar así:

```jsx
import React from "react";

import Button from "./Button";

const PlatformSpecificButton = () => {
  return <Button />;
};
```

Ahora, el paquete de Android de la aplicación tendrá el componente definido en Button.android.jsx mientras que el paquete de iOS tendrá uno definido en el archivo Button.ios.jsx.
