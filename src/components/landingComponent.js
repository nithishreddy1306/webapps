import React from 'react';
import io from 'socket.io-client';
import socketFileUpload from 'socketio-file-upload';
import axios from 'axios';
import {
    Row,
    Col,
    Typography,
    Upload,
    Button,
    message
} from 'antd';
import {
    InboxOutlined,
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const { Dragger } = Upload;
const { Title } = Typography;
const serverUrl = 'http://localhost:8080';

class LandingComponent extends React.Component {
    constructor() {
        super();
        this.socket = io('http://localhost:8080');
        this.uploader = new socketFileUpload(this.socket);
    }

    state = {
        files: [],
        listOfFiles: []
    }

    componentDidMount() {
        this.getFilesFromServer();
        this.uploader.addEventListener('progress', (event) => {
            let percent = event.bytesLoaded / event.file.size * 100;
            console.log("File is", percent.toFixed(2), "percent loaded");
        })

        this.uploader.addEventListener('complete', (e) => {
            if (e.success) {
                this.setState({ files: [] });
                message.success('Successfully uploaded the file');
                this.getFilesFromServer();
            } else {
                message.error('Failed to upload file');
            }
        })
    }

    getFilesFromServer = () => {
        axios.get(serverUrl + '/api/getFiles').then(res => {
            if (res.data) {
                this.setState({ listOfFiles: res.data });
            }
        })
            .catch(e => console.log(e));
    }

    collectFiles = (e) => {
        this.setState(prevState => ({
            files: [...prevState.files, e]
        }))
        return false;
    }

    uploadFiles = () => {
        this.uploader.submitFiles(this.state.files);
    }

    deleteFile = (name, index) => {
        axios.delete(serverUrl + '/api/files?name=' + name)
            .then(res => {
                if (res.data) {
                    let fileList = this.state.listOfFiles;
                    fileList.splice(index, 1);
                    this.setState({ listOfFiles: fileList });
                }
            })
            .catch(e => console.log(e));
    }

    listFiles = () => {
        const { listOfFiles } = this.state;

        if (listOfFiles === 0) {
            return ('No Files');
        } else {
            return listOfFiles.map((file, i) => {
                return (
                    <div style={{
                        'marginBottom': '20px'
                    }}>
                        <span>{i + 1}. {file}</span>
                        <span style={{ 'float': 'right', 'paddingRight': '20px', 'cursor': 'pointer', 'color': 'red' }}
                            onClick={() => this.deleteFile(file, i)} title="Delete"
                        >
                            <DeleteOutlined />
                        </span>
                        <span style={{ 'float': 'right', 'paddingRight': '20px', 'cursor': 'pointer' }} title="Download">
                            <a href={`${serverUrl + '/api/file/download?name=' + file}`}><DownloadOutlined /></a>
                        </span>
                    </div>
                )
            })
        }
    }

    render() {
        return (
            <div style={{
                'padding': '20px 7%',
            }}>
                <Row>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} align="center">
                        <Title level={4}>Uploader</Title>
                    </Col>
                    <Col xs={16} sm={16} md={16} lg={16} xl={16} align="center">
                        <Title level={4}>List of files uploaded
                        {this.state.listOfFiles.length ? ` (${this.state.listOfFiles.length})` : ''}
                        </Title>
                    </Col>
                </Row>

                <Row>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} align="center">
                        <Dragger
                            beforeUpload={this.collectFiles}
                            fileList={this.state.files}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Dragger>
                        <br />
                        <Button onClick={() => this.uploadFiles()}>Upload</Button>
                    </Col>
                    <Col xs={16} sm={16} md={16} lg={16} xl={16} style={{ 'paddingLeft': '5%' }}>
                        {this.listFiles()}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default LandingComponent;