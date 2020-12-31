/* eslint-disable brace-style */
import React from 'react'
import ChartWithDetails from '../shared/components/chart-with-details'
import Footer from '../shared/components/footer'
import addDragDrop from '../shared/util/dragdrop'
import readFile from '../shared/util/readFile'
import formatSize from '../shared/util/formatSize'
import { getAssetsData, getBundleDetails, ERROR_CHUNK_MODULES } from '../shared/util/stat-utils'
import buildHierarchy from '../shared/buildHierarchy'
import ErrorBoundary from '../shared/components/errorBoundary'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			assets: [],
			needsUpload: true,
			dragging: false,
			chartData: null,
			selectedAssetIndex: 0,
		}

		this.FileInput = React.createRef()
		this.UploadArea = React.createRef()

		this.loadDemo = this.loadDemo.bind(this)
		this.onFileChange = this.onFileChange.bind(this)
		this.onAssetChange = this.onAssetChange.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.renderUploadArea = this.renderUploadArea.bind(this)
	}

	componentDidMount() {
		addDragDrop({
			el: this.UploadArea.current,
			callback: (file) => {
				readFile(file, this.handleFileUpload)
			},
			onDragStart: () => {
				this.setState({
					dragging: true,
				})
			},
			onDragEnd: () => {
				this.setState({
					dragging: false,
				})
			},
		})
	}

	onFileChange(ev) {
		readFile(ev.target.files[0], this.handleFileUpload)
	}

	handleFileUpload(jsonText) {
		let stats = JSON.parse(jsonText)
		let assets = getAssetsData(stats.assets, stats.chunks)

		this.setState({
			assets,
			chartData: buildHierarchy(stats.modules),
			needsUpload: false,
			selectedAssetIndex: 0,
			stats,
		})
	}

	clickFileInput() {
		if (this.state.needsUpload) {
			this.FileInput.current.click()
		}
	}

	loadDemo() {
		this.setState({
			demoLoading: true,
		})

		let request = new XMLHttpRequest()
		request.open('GET', 'stats-demo.json', true)

		request.onload = () => {
			this.setState({
				demoLoading: false,
			})

			if (request.status >= 200 && request.status < 400) {
				this.handleFileUpload(request.response)
			}
		}

		request.send()
	}

	onAssetChange(ev) {
		let selectedAssetIndex = Number(ev.target.value)
		let modules, chartData, error

		if (selectedAssetIndex === 0) {
			modules = this.state.stats.modules
		} else {
			let asset = this.state.assets[selectedAssetIndex - 1]
			modules = asset.chunk.modules
		}

		if (modules) {
			chartData = buildHierarchy(modules)
		} else {
			error = ERROR_CHUNK_MODULES
		}

		this.setState({
			chartData,
			error,
			selectedAssetIndex,
		})
	}

	renderUploadArea(uploadAreaClass) {
		return (
			<div ref={this.UploadArea} className={uploadAreaClass} onClick={this.clickFileInputRef}>
				<div className="uploadArea-uploadMessage">
					<p>Drop JSON file here or click to choose.</p>
					<small>
						Files won&apos;t be uploaded &mdash; your data stays in your browser.
					</small>
				</div>
				<input
					ref={this.FileInput}
					type="file"
					className="hiddenFileInput"
					onChange={this.onFileChange}
				/>
			</div>
		)
	}

	render() {
		let assetList
		let demoButton
		let bundleDetails = {}
		let uploadAreaClass = 'uploadArea'

		if (this.state.dragging) {
			uploadAreaClass += ' uploadArea--dragging'
		}

		if (this.state.needsUpload) {
			uploadAreaClass += ' uploadArea--needsUpload'

			let demoClass = 'destyledButton'
			if (this.state.demoLoading) {
				demoClass += ' demoLoading'
			}

			demoButton = (
				<button
					onClick={this.loadDemo}
					className={demoClass}
					style={{ marginTop: '0.5em' }}
				>
					Try a Demo
				</button>
			)
		}

		if (this.state.stats) {
			bundleDetails = getBundleDetails({
				assets: this.state.assets,
				selectedAssetIndex: this.state.selectedAssetIndex,
			})
		}

		if (this.state.assets.length > 1) {
			assetList = (
				<select onChange={this.onAssetChange} value={this.state.selectedAssetIndex}>
					<option value={0}>All Chunks</option>
					{this.state.assets.map((asset, i) => (
						<option key={i} value={i + 1}>
							{asset.name} ({formatSize(asset.size)})
						</option>
					))}
				</select>
			)
		}

		return (
			<ErrorBoundary>
				<h1>Webpack Visualizer</h1>

				<React.Fragment>{assetList}</React.Fragment>
				{this.state.needsUpload && this.renderUploadArea(uploadAreaClass)}
				{demoButton && demoButton}

				<ChartWithDetails chartData={this.state.chartData} bundleDetails={bundleDetails} />

				{this.state.error && <div className="errorMessage">{this.state.error}</div>}

				<Footer>
					<h2>How do I get stats JSON from webpack?</h2>
					<p>
						<code>webpack --json &gt; stats.json</code>
					</p>
				</Footer>
			</ErrorBoundary>
		)
	}
}

export default App
