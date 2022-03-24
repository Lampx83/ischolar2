module.exports = {

    getBaseAPI: function () {
        if (process.env.NODE_ENV === 'development')
            return 'https://localhost';
        else
            return 'https://www.vncodelab.com'
    }

}

