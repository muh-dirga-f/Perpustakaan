import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Alert,
    Modal,
    Pressable,
    TextInput,
    Button,
    FlatList,
    ImageBackground,
    LogBox,
    Platform,
    Image
} from 'react-native';

import { Card, ListItem, Avatar, Icon } from 'react-native-elements';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const urlServer = 'http://192.168.43.200/perpus/';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            scale: 3,
            fitWidth: true,
            numberOfPages: 0,
            horizontal: false,
            width: WIN_WIDTH,
            pageLoaded: false,
            fullname: '',
            username: '',
            id_user: '',
        };
        this.pdf = null;
        this.statusUser = 0;
    }

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead']);
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
        LogBox.ignoreLogs(['Cannot update a component (`StackNavigator`) while rendering a different component (`Unknown`)']);
        LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component"]);
    }

    HomeScreen = ({ navigation }) => {
        const [modalVisible, setModalVisible] = useState(false);
        const [data, setData] = useState([]);
        const [data1, setData1] = useState([]);
        useEffect(() => {
            fetch(urlServer + '/json/populer')
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
            fetch(urlServer + '/json/bukuterbaru')
                .then((response) => response.json())
                .then((json) => setData1(json))
                .catch((error) => console.error(error))
        }, []);
        let carouselItem = ({ item, index }) => {
            const image = { uri: urlServer + '/assets/img/buku/' + item.image }
            return (
                <TouchableHighlight
                    style={styles.carouselBtn}
                    onPress={() => {
                        navigation.navigate('Book');
                        setTimeout(() => {
                            fetch(urlServer + `/json/add_log_buku?user=${this.state.id_user}&kode=${item.kode_buku}`);
                            navigation.navigate('Book', {
                                screen: 'Pdf',
                                params: {
                                    filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                    titlePdf: item.judul,
                                    kodeBuku: item.kode_buku,
                                }
                            })
                        }, 1);
                    }}
                >
                    <ImageBackground source={image} style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
                    </ImageBackground>
                </TouchableHighlight>
            )
        };
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <Card>
                        <Card.Title>Pondok Pesantren Al-Urwatul Wutsqa</Card.Title>
                        <Card.Divider />
                        <Text style={{ textAlign: "justify", marginBottom: 15, }}>
                            {'    '}Sidenreng Rappang (Sidrap) merupakan salah satu kabupaten yang akrab dengan dunia pesantren. Salah satu pesantren yang ternama di kabupaten berjuluk Bumi Nene Mallomo ini adalah Pondok Pesantren Al -Urwatul Wutsqaa (PPUW).
                        </Text>
                        <Text style={{ textAlign: "justify", marginBottom: 15, }}>
                            {'    '}Lokasinnya berada di wilayah perkampungan yang jaraknya sekitar 3 Km dari area perkotaan. Tepatnya di Kelurahan Benteng, Kecamatan Baranti, Kabupaten Sidrap, Sulawesi Selatan.
                        </Text>
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.textStyle}>Baca Selengkapnya</Text>
                        </Pressable>
                    </Card>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView>
                                    <Text style={styles.modalText}>
                                        {'    '}Sidenreng Rappang (Sidrap) merupakan salah satu kabupaten yang akrab dengan dunia pesantren. Salah satu pesantren yang ternama di kabupaten berjuluk Bumi Nene Mallomo ini adalah Pondok Pesantren Al -Urwatul Wutsqaa (PPUW).
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Lokasinnya berada di wilayah perkampungan yang jaraknya sekitar 3 Km dari area perkotaan. Tepatnya di Kelurahan Benteng, Kecamatan Baranti, Kabupaten Sidrap, Sulawesi Selatan.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}"Pesantren ini didirikan oleh AGH Abd Muin Yusuf alias Gurutta Kali Sidenreng, pada tanggal 1 Januari 1974 silam,"
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Ia menyebutkan, penggunaan nama Al-Urwatul Wutsqaa diambil dari penggalan kalimat ayat suci Alquran yang termaktub dalam Q.S. Al-Baqarah ayat 256.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Al-Urwatul Wutsqa dalam ayat tersebut diartikan sebagai tali yang kokoh.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Melalui penamaan itu, Gurutta tentu mengharapkan PPUW menjadi pusat persatuan umat yang diikat dalam tali agama Allah yang kokoh.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Apalagi, PPUW berdiri bersamaan dengan maraknya perdebatan-perdebatan furu'iyah yang terjadi di tengah kalangan umat Islam kala itu.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}"Gurutta pun mendirikan pesantren dengan dibaluti niat suci untuk menghilangkan beragam perdabatan yang ada," jelas Asri.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Dilain sisi, pengunaan Al-Urwatul Wutsqa juga diambil dari nama sebuah majalah yang diusung oleh tokoh Islam bernama Jamaluddin Al-Afgani.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Konon, majalah itu terbit ditopang oleh semangat membumikan persatuan, dalam rangka merespon maraknya adu domba yang dihembuslan oleh kaum penjajah di tengah kalangan umat Islam pada tahun 1800-an.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}"Jadi lagi-lagi spiritnya adalah persatuan. Sedari dulu Gurutta Kali Sidenreng memang dikenal sebagai ulama yang ahli dalam menengahi dan meredam beragam problem yang terjadi di tengah masyarakat," papar Aris.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Selain itu, semangat pendirian pesantren juga ditopang oleh pemahaman Gurutta Kali Sidenreng terkait prinsip Al-Ilmu Nuurun (Ilmu adalah cahaya), sesuai pesan yang pernah dituliskan oleh Imam Syafi'i.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Melalui ilmu, seseorang akan mudah tertuntun menuju jalan kebaikan dan kebenaran.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Berangkat dari beragam prinsip suci itulah, PPUW pun berhasil didirikan di atas sebidang tanah yang mulanya luasnya tak cukup 1 hektar.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Tanah itu diwaqafkan oleh salah seorang tokoh masyarakat bernama Muhammad Taha Laili.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Seiring berjalannya waktu, pesantren tertua di Kabupaten Sidrap itu pun kian berkembang, hingga banyak tokoh masyarakat lain yang menyusul mewaqafkan tanahnya.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}"Alhamdulillah, sekarang luasnya sudah mencapai sekitar 8 hektar. Semua itu adalah waqaf dari masyarakat," jelas Asri.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Secara kelembagaan, lanjutnya, pesantren tersebut berdiri dengan tujuan untuk membentuk pribadi muslim Indonesia yang bertaqwa kepada Allah swt, berakhlakul karimah, berilmu, cakap dan bertanggungjawab dalam mengamalkan ilmu pengetahuannya.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Itulah sebabnya, pesantren ini menyuguhkan beragam pengajaran ilmu untuk para santri.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Baik itu yang berkaitan dengan pengetahuan umum, pengajian kitab gundul, tahfidzul quran, program bahasa (Arab dan Inggris), hingga ekstrakurikulier.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}"Semoga pesantren ini senantiasa mampu mencetak kader-kader ulama sebagai pewaris para nabi," pungkas Aris.
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {'    '}Informasi yang dihimpun, pesantren ini terdata memiliki 27 pembina dan 1200 santri yang terdiri dari tingkat MTs dan MA.
                                    </Text>
                                </ScrollView>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Tutup</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Carousel
                        autoplay={true}
                        loop={true}
                        layout={"default"}
                        ref={ref => this.carousel = ref}
                        data={data}
                        sliderWidth={WIN_WIDTH}
                        itemWidth={WIN_WIDTH / 3}
                        renderItem={carouselItem}
                        onSnapToItem={index => this.setState({ activeIndex: index })}
                    />
                    <Text style={{ fontSize: 25 }}> List Buku Terbaru!</Text>
                    {
                        data1.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => {
                                    navigation.navigate('Book');
                                    setTimeout(() => {
                                        fetch(urlServer + `/json/add_log_buku?user=${this.state.id_user}&kode=${item.kode_buku}`);
                                        navigation.navigate('Book', {
                                            screen: 'Pdf',
                                            params: {
                                                filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                                titlePdf: item.judul,
                                                kodeBuku: item.kode_buku,
                                            }
                                        })
                                    }, 1);
                                }}
                            >
                                <Avatar title={item.judul} source={urlServer + '/assets/img/buku/' + item.image && { uri: urlServer + '/assets/img/buku/' + item.image }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.judul}</ListItem.Title>
                                    <ListItem.Subtitle>{item.pengarang}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }

    BukuStack = () => {
        return (
            <Stack.Navigator initialRouteName="KategoriBuku">
                <Stack.Screen name="KategoriBuku" component={this.KategoriBukuScreen} />
                <Stack.Screen name="ListBuku" component={this.ListBukuScreen} />
                <Stack.Screen name="Pdf" component={this.PdfScreen} />
            </Stack.Navigator>
        );
    }

    KategoriBukuScreen = ({ navigation }) => {
        navigation.setOptions({ title: 'Kategori Buku' });
        const [isLoading, setLoading] = useState(true);
        const [data, setData] = useState([]);
        useEffect(() => {
            fetch(urlServer + '/json/katbuku')
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }, []);
        return (
            <ScrollView>
                <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                    {isLoading ? <ActivityIndicator /> : (
                        data.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => navigation.navigate('ListBuku', {
                                    idKategori: item.id_kategori_buku,
                                    namaKategori: item.nama_kategori_buku
                                })}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{item.nama_kategori_buku}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    )}
                </View>
            </ScrollView>
        );
    }

    ListBukuScreen = ({ route, navigation }) => {
        const [isLoading, setLoading] = useState(true);
        const [data, setData] = useState([]);
        const { idKategori, namaKategori } = route.params;
        navigation.setOptions({ title: 'List Buku "' + namaKategori + '"' });
        useEffect(() => {
            fetch(urlServer + '/json/listkatbuku?data=' + idKategori)
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }, []);
        return (
            <ScrollView>
                <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                    {isLoading ? <ActivityIndicator /> : (
                        data.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => {
                                    fetch(urlServer + `/json/add_log_buku?user=${this.state.id_user}&kode=${item.kode_buku}`);
                                    navigation.navigate('Book');
                                    setTimeout(() => {
                                        navigation.navigate('Book', {
                                            screen: 'Pdf',
                                            params: {
                                                filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                                titlePdf: item.judul,
                                                kodeBuku: item.kode_buku,
                                            }
                                        })
                                    }, 1);
                                }}
                            >
                                <Avatar title={item.judul} source={urlServer + '/assets/img/buku/' + item.image && { uri: urlServer + '/assets/img/buku/' + item.image }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.judul}</ListItem.Title>
                                    <ListItem.Subtitle>{item.pengarang}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    )}
                </View>
            </ScrollView>
        );
    }

    PdfScreen = ({ route, navigation }) => {
        const { filePdf, titlePdf, kodeBuku } = route.params;
        navigation.setOptions({ title: titlePdf });

        let source = { uri: filePdf, cache: true };
        return (
            <View style={styles.container}>
                <Pdf ref={(pdf) => {
                    this.pdf = pdf;
                    this.setState({
                        pageLoaded: false
                    });
                }}
                    source={source}
                    scale={this.state.scale}
                    fitWidth={this.state.fitWidth}
                    horizontal={this.state.horizontal}
                    onLoadComplete={
                        () => {
                            if (!this.state.pageLoaded) {
                                fetch(urlServer + `/json/findPageBuku?id_user=${this.state.id_user}&id_buku=${kodeBuku}`)
                                    .then((response) => response.json())
                                    .then((pageNumber) => {
                                        setTimeout(() => {
                                            if (pageNumber.page) {
                                                this.pdf.setPage(parseInt(pageNumber.page))
                                            }
                                        }, 1000);
                                    })
                                    .catch((error) => console.error(error))
                                this.setState({
                                    pageLoaded: true
                                });
                            }
                        }
                    }
                    onPageChanged={(page, numberOfPages) => {
                        if (this.statusUser == 1) {
                            fetch(urlServer + `/json/savePageBuku?id_user=${this.state.id_user}&id_buku=${kodeBuku}&page=${page}`);
                            // console.warn(page);
                        }
                    }}
                    // onLoadComplete={(numberOfPages, filePath, { width, height }, tableContents) => {
                    //     this.setState({
                    //         numberOfPages: numberOfPages
                    //     });
                    //     // if (!this.state.pageLoaded) {
                    //     //     setTimeout(() => {
                    //     //         this.pdf.setPage(2);
                    //     //     }, 1000);
                    //     //     this.setState({
                    //     //         pageLoaded: true
                    //     //     });
                    //     // }
                    //     console.log(`total page count: ${numberOfPages}`);
                    // }}
                    // onPageChanged={(page, numberOfPages) => {
                    //     this.setState({
                    //         page: page
                    //     });
                    //     console.log(`current page: ${page}`);
                    // }}
                    // onError={(error) => {
                    //     console.log(error);
                    // }}
                    style={styles.pdf}
                />
            </View>
        );
    }

    VideoStack = () => {
        return (
            <Stack.Navigator initialRouteName="KategoriVideo">
                <Stack.Screen name="KategoriVideo" component={this.KategoriVideoScreen} />
                <Stack.Screen name="ListVideo" component={this.ListVideoScreen} />
                <Stack.Screen name="Video" component={this.VideoScreen} />
            </Stack.Navigator>
        );
    }

    KategoriVideoScreen = ({ navigation }) => {
        navigation.setOptions({ title: 'Kategori Video' });
        const [isLoading, setLoading] = useState(true);
        const [data, setData] = useState([]);
        useEffect(() => {
            fetch(urlServer + '/json/katvideo')
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }, []);
        return (
            <ScrollView>
                <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                    {isLoading ? <ActivityIndicator /> : (
                        data.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => navigation.navigate('ListVideo', {
                                    idKategori: item.id_kategori_video,
                                    namaKategori: item.nama_kategori_video
                                })}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{item.nama_kategori_video}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    )}
                </View>
            </ScrollView>
        );
    }

    ListVideoScreen = ({ route, navigation }) => {
        const [isLoading, setLoading] = useState(true);
        const [data, setData] = useState([]);
        const { idKategori, namaKategori } = route.params;
        navigation.setOptions({ title: 'List Video "' + namaKategori + '"' });
        useEffect(() => {
            fetch(urlServer + '/json/listkatvideo?data=' + idKategori)
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }, []);
        return (
            <ScrollView>
                <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                    {isLoading ? <ActivityIndicator /> : (
                        data.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => navigation.navigate('Video', {
                                    fileVideo: urlServer + '/assets/video/' + item.file,
                                    titleVideo: item.judul,
                                })}
                            >
                                <Avatar title={item.judul} source={urlServer + '/assets/img/video/' + item.image && { uri: urlServer + '/assets/img/video/' + item.image }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.judul}</ListItem.Title>
                                    <ListItem.Subtitle>{item.pembuat}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    )}
                </View>
            </ScrollView>
        );
    }

    VideoScreen = ({ route, navigation }) => {
        const { fileVideo, titleVideo } = route.params;
        navigation.setOptions({ title: titleVideo });
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Video
                    controls={true}
                    source={{ uri: fileVideo }}   // Can be a URL or a local file.
                    ref={(ref) => {
                        this.player = ref
                    }}// Store reference
                    style={styles.backgroundVideo} />
            </View>
        );
    }

    LoginStack = () => {
        return (
            <Stack.Navigator initialRouteName="LoginForm">
                <Stack.Screen name="LoginForm" component={this.LoginScreen} />
                <Stack.Screen name="RegisterForm" component={this.RegisterScreen} />
            </Stack.Navigator>
        );
    }

    LoginScreen = ({ route, navigation }) => {
        navigation.setOptions({ title: 'Form Login' });
        let Username = '';
        let Password = '';
        const onPressLogin = () => {
            // console.warn(Username,Password)
            fetch(urlServer + `/json/login?username=${Username.toLowerCase()}&password=${Password}`)
                .then((response) => response.json())
                .then((json) => {
                    // console.warn(json.id_user)
                    if (json.status == true) {
                        this.statusUser = 1;
                        this.setState({
                            id_user: json.id_user,
                            fullname: json.fullname,
                            username: json.username,
                        });
                        navigation.navigate('Home');
                    } else {
                        Alert.alert("Login", "username atau password salah!")
                    }
                })
                .catch((error) => console.error(error))
        }
        const onPressRegister = () => {
            navigation.navigate('RegisterForm');
        }
        return (
            <View style={{ flex: 1, }}>
                <TextInput
                    placeholder="Username"
                    onChangeText={(text) => Username = text}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={(text) => Password = text}
                    keyboardType="numeric"
                />
                <Button
                    onPress={onPressLogin}
                    title="Login"
                    color="#841584"
                />
                <Text>Belum punya akun?</Text>
                <Button
                    onPress={onPressRegister}
                    title="Register"
                    color="#841584"
                />
            </View>
        );
    }

    RegisterScreen = ({ route, navigation }) => {
        navigation.setOptions({ title: 'Form Register' });
        let Username = '';
        let Password = '';
        let Fullname = '';
        const onPressRegister = () => {
            // console.warn(Username,Password)
            if (Username == '' || Password == '' || Fullname == '') {
                Alert.alert("Register", "Data tidak boleh kosong!")
            } else {
                fetch(urlServer + `/json/register?username=${Username.toLowerCase()}&password=${Password}&fullname=${Fullname}`)
                    .then((response) => {
                        navigation.navigate('LoginForm');
                        Alert.alert("Register", "Data Tersimpan!")
                    })
                    .catch((error) => console.error(error))
            }
        }
        return (
            <ScrollView>
                <View style={{ flex: 1, }}>
                    <TextInput
                        placeholder="Fullname"
                        onChangeText={(text) => Fullname = text}
                    />
                    <TextInput
                        placeholder="Username"
                        onChangeText={(text) => Username = text}
                    />
                    <TextInput
                        placeholder="Password"
                        onChangeText={(text) => Password = text}
                        keyboardType="numeric"
                    />
                    <Button
                        onPress={onPressRegister}
                        title="Register"
                        color="#841584"
                    />
                </View>
            </ScrollView>
        );
    }

    UserScreen = ({ route, navigation }) => {
        const [isLoading, setLoading] = useState(true);
        const [data, setData] = useState([]);
        useEffect(() => {
            fetch(urlServer + '/json/listBukuUser/' + this.state.id_user)
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        });
        const onPressLogout = () => {
            this.statusUser = 0;
            this.setState({
                id_user: '',
                fullname: '',
                username: '',
            });
            navigation.navigate('Home');
        }
        return <>
            <Text style={{ fontSize: 25 }}> Halo {this.state.fullname}</Text>
            <Button
                onPress={onPressLogout}
                title="Logout"
                color="#841584"
            />
            <Text style={{ fontSize: 25 }}> Data buku yang sudah dibaca</Text>
            <ScrollView>
                <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                    {isLoading ? <ActivityIndicator /> : (
                        data.map((item, i) => (
                            <ListItem key={i}
                                bottomDivider
                                onPress={() => {
                                    fetch(urlServer + `/json/add_log_buku?user=${this.state.id_user}&kode=${item.kode_buku}`);
                                    navigation.navigate('Book');
                                    setTimeout(() => {
                                        navigation.navigate('Book', {
                                            screen: 'Pdf',
                                            params: {
                                                filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                                titlePdf: item.judul,
                                                kodeBuku: item.kode_buku,
                                            }
                                        })
                                    }, 1);
                                }}
                            >
                                <Avatar title={item.judul} source={urlServer + '/assets/img/buku/' + item.image && { uri: urlServer + '/assets/img/buku/' + item.image }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.judul}</ListItem.Title>
                                    <ListItem.Subtitle>{item.pengarang}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    )}
                </View>
            </ScrollView>
        </>;
    }

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    tabBarOptions={{
                        activeTintColor: 'seagreen',
                    }}
                >
                    {(this.statusUser == 0) ?
                        <>
                            <Tab.Screen
                                name="Home"
                                component={this.HomeScreen}
                                options={{
                                    tabBarLabel: 'Home',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="home" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Book"
                                component={this.BukuStack}
                                options={{
                                    tabBarLabel: 'Buku',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="book" color={color} size={size} />
                                    ),
                                    // tabBarBadge: 3,
                                }}
                            />
                            <Tab.Screen
                                name="Video"
                                component={this.VideoStack}
                                options={{
                                    tabBarLabel: 'Video',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="play" color={color} size={size} />
                                    ),
                                    // tabBarBadge: 3,
                                }}
                            />
                            <Tab.Screen
                                name="Login"
                                component={this.LoginStack}
                                options={{
                                    tabBarLabel: 'Login',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="user-alt" color={color} size={size} />
                                    ),
                                }}
                            />
                        </>
                        :
                        <>

                            <Tab.Screen
                                name="Home"
                                component={this.HomeScreen}
                                options={{
                                    tabBarLabel: 'Home',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="home" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Book"
                                component={this.BukuStack}
                                options={{
                                    tabBarLabel: 'Buku',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="book" color={color} size={size} />
                                    ),
                                    // tabBarBadge: 3,
                                }}
                            />
                            <Tab.Screen
                                name="Video"
                                component={this.VideoStack}
                                options={{
                                    tabBarLabel: 'Video',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="play" color={color} size={size} />
                                    ),
                                    // tabBarBadge: 3,
                                }}
                            />
                            <Tab.Screen
                                name="User"
                                component={this.UserScreen}
                                options={{
                                    tabBarLabel: 'User',
                                    tabBarIcon: ({ color, size }) => (
                                        <FontAwesome5 name="user-alt" color={color} size={size} />
                                    ),
                                }}
                            />
                        </>
                    }
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerLogin: {
        // flex: 1,
        backgroundColor: '#f5f5f5',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    carouselBtn: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'floralwhite',
        borderRadius: 5,
        height: 250,
        padding: 5,
        margin: 25,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: WIN_HEIGHT - 100
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 200,
    },
    buttonOpen: {
        backgroundColor: "#00E676",
    },
    buttonClose: {
        marginTop: 10,
        marginBottom: -20,
        backgroundColor: "#FF5252",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "justify"
    }
});

export default App;