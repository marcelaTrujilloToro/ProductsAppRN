/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {Picker} from '@react-native-picker/picker';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/productsContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id = '', name = ''} = route.params;

  const [tempUri, setTempUri] = useState<string>();

  const {categories} = useCategories();

  const {
    loadProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  } = useContext(ProductsContext);

  const {_id, categoriaId, nombre, img, onChange, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });

  useEffect(() => {
    navigation.setOptions({
      title: nombre ? nombre : 'Sin nombre del producto',
    });
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) {
      return;
    }
    const product = await loadProductById(id);
    setFormValue({
      _id: _id,
      categoriaId: product.categoria._id,
      nombre: name,
      img: product.img || '',
    });
  };

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const deleteProd = async () => {
    if (id.length > 0) {
      deleteProduct(id);
    }
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) {
          return;
        }
        if (!resp.assets?.uri) {
          return;
        }

        setTempUri(resp.assets?.uri);
        uploadImage(resp, _id);
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) {
          return;
        }
        if (!resp) {
          return;
        }

        // por algun motivo assets es un array, si no se usa la posicion 0 siempre retorna undefined
        setTempUri(resp.assets[0].uri);
        uploadImage(resp, _id);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto: </Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        <Text style={styles.label}>Categoria: </Text>

        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {categories.map(category => (
            <Picker.Item
              label={category.nombre}
              value={category._id}
              key={category._id}
            />
          ))}
        </Picker>

        <Button title="Guardar" color="#5856D6" onPress={saveOrUpdate} />
        {_id.length > 0 && (
          <Button title="Eliminar" color="red" onPress={deleteProd} />
        )}

        {_id.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <Button title="Cámara" color="#5856D6" onPress={takePhoto} />
            <Button
              title="Galería"
              color="#5856D6"
              onPress={takePhotoFromGallery}
            />
          </View>
        )}
        {img.length > 0 && !tempUri && (
          <Image
            source={{uri: img}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}

        {tempUri && (
          <Image
            source={{uri: tempUri}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 10,
  },
});
