import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';

import api from '../../services/api';
import styles from './styles';

import more from '../../assets/more.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import send from '../../assets/send.png';

export default class Feed extends Component {
    state = {
        feed: []
    }
  
    async componentDidMount() {
        this.registerToSocket()
        const response = await api.get('posts')
        this.setState({ feed: response.data })
    }
  
    registerToSocket = () => {
        const socket = io('http:/10.17.1.69:3333')
  
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] })
        })
  
        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post => (
                    post._id === likedPost._id ? likedPost : post
                ))
            })
        })
    }
  
    handleLike = (id) => {
      api.post(`posts/${id}/like`)
    }
    

    render() {
        return (
            <View style={styles.container}>
                <FlatList data={this.state.feed}
                    keyExtractor={post => post._id}
                    renderItem={({ item }) => (
                        <View style={styles.feedItem}>
                            <View style={styles.feedItemHeader}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.name}>{item.author}</Text>
                                    <Text style={styles.place}>{item.place}</Text>
                                </View>
                                <Image source={more} />
                            </View>
                            <Image style={styles.feedImage} source={{ uri: `http://10.1.17.69:3333/files/${item.image}` }} />
  
                            <View style={styles.feedItemFooter}>
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                                        <Image source={like} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                                        <Image source={comment} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                                        <Image source={send} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.likes}>{item.likes} curtidas</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.hashtags}>{item.hashtags}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        )
    }
  }