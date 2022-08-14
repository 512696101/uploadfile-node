var express = require('express')
var router = express.Router()
const path = require('path')
const fs = require('fs')
var multer = require('multer')

const uploadFilePath = path.join(__dirname, '../uploads')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const name = req.body.fileName
    cb(null, uploadFilePath + '/' + 'temp-' + name)
  },
  filename: function (req, file, cb) {
    const name = req.body.fileName
    const index = req.body.index
    cb(null, index + '-' + name)
  },
})

const upload = multer({ storage: storage }).single('file')
router.post('/', function (req, res) {
  upload(req, res, function (err) {
    
    if (err instanceof multer.MulterError) {
      // 发生错误
      throw err
    } else if (err) {
      // 发生错误
    
      throw err
    }
      if (req.body.type === 'merge') {
        const fileName = req.body.fileName
        const filePath = uploadFilePath + '/' + 'temp-' + fileName
        let writeStream = fs.createWriteStream(uploadFilePath + '/' + fileName)
        let fileList = fs.readdirSync(filePath).sort(function (a, b) {
          let start = a.substring(0, a.indexOf('-'))
          let end = b.substring(0, b.indexOf('-'))
          return +start - +end
        })
        function mergeFile(filesDir = [], valueWriteStream) {
          // filesDir 目录下文件名集合数组形参
          // valueWriteStream 创建的可写流形参
          if (!filesDir.length) {
            // setTimeout(() => {
            //   console.log('删除临时目录')
            //   fs.rmdir(uploadFilePath + '/' + 'temp-' + fileName, (err) => {
            //     if (err) {
            //       throw err
            //     }
            //   })
            // },10000)
            return valueWriteStream.end()
          }
          const readStreamPath = filePath + '/' + filesDir.shift()
          const readStream = fs.createReadStream(readStreamPath) // 获取当前的可读流

          readStream.pipe(valueWriteStream, { end: false })
          readStream.on('end', function () {
            mergeFile(filesDir, valueWriteStream)
            // 本次文件合并成功之后 把这个文件删除
            fs.unlink(readStreamPath, function (err) {
              if (err) {
                throw err
              }
            })
          })

          readStream.on('error', function (error) {
            // 监听错误事件，关闭可写流，防止内存泄漏
            console.error(error)
            valueWriteStream.close()
          })
        }

        mergeFile(fileList, writeStream)
        return res.send({ code: 200, msg: '合并成功' })
      }
    res.send({code:200})
  })
})

router.get('/', async function (req, res, next) {
  try {
    const name = req.query.name
    fs.readdir(uploadFilePath + '/' + 'temp-' + name, function (err, files) {
      if (err) {
        fs.mkdirSync(uploadFilePath + '/' + 'temp-' + name)
        res.send({
          code: 200,
          schedule: 0,
        })
      } else {
      console.log(files.length,'files.lengthfiles.lengthfiles.length')

        const unLinkPath =
          uploadFilePath +
          '/' +
          'temp-' +
          name +
          '/' +
          (+files.length - 1) +
          '-' +
          name
          res.send({
            code: 200,
            schedule: files.length - 1,
          })
        return
        fs.unlink(unLinkPath, (err) => {
          if (err) {
            throw err
          }
          res.send({
            code: 200,
            schedule: files.length - 1,
          })
        })
      }
    })
  } catch (error) {
    res.sendStatus(500)
    throw error
  }
})
module.exports = router
