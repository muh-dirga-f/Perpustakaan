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
    Button,
    FlatList,
    ImageBackground,
    LogBox,
    Platform
} from 'react-native';

import { ListItem, Avatar, Icon } from 'react-native-elements';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginScreen from './src/login/login.js';

const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const urlServer = 'http://192.168.1.200/myapp/perpus/';

export default class App extends React.Component {
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
        };
        this.pdf = null;
    }

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead']);
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
        LogBox.ignoreLogs(['Cannot update a component (`StackNavigator`) while rendering a different component (`Unknown`)']);
    }

    HomeScreen = ({ navigation }) => {
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
                            navigation.navigate('Book', {
                                screen: 'Pdf',
                                params: {
                                    filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                    titlePdf: item.judul,
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
                                        navigation.navigate('Book', {
                                            screen: 'Pdf',
                                            params: {
                                                filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                                titlePdf: item.judul,
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
            <View style={{ flex: 1, /*justifyContent: 'center', alignItems: 'center'*/ }}>
                {isLoading ? <ActivityIndicator /> : (
                    data.map((item, i) => (
                        <ListItem key={i}
                            bottomDivider
                            onPress={() => {
                                navigation.navigate('Book');
                                setTimeout(() => {
                                    navigation.navigate('Book', {
                                        screen: 'Pdf',
                                        params: {
                                            filePdf: urlServer + '/assets/pdf/ebook/' + item.ebook,
                                            titlePdf: item.judul,
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
        );
    }

    PdfScreen = ({ route, navigation }) => {
        const { filePdf, titlePdf } = route.params;
        navigation.setOptions({ title: titlePdf });

        let source = { uri: filePdf, cache: true };
        return (
            <View style={styles.container}>
                <Pdf ref={(pdf) => {
                    this.pdf = pdf;
                }}
                    source={source}
                    scale={this.state.scale}
                    fitWidth={this.state.fitWidth}
                    horizontal={this.state.horizontal}
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

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    tabBarOptions={{
                        activeTintColor: 'seagreen',
                    }}
                >
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
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    }
});