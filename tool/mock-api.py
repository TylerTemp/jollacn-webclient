import flask
import json


app = flask.Flask(__name__)


@app.route('/post')
def article_list():
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'article_infos': [
            {
                'slug': 'test %s' % (offset + 1),
                'title': 'test title %s' % (offset + 1),
                'description': 'description',
                'author': 'test_author',
            },
            {
                'slug': 'test %s' % (offset + 2),
                'title': 'test title %s' % (offset + 2),
                'description': 'description2',
                'author': 'test_author',
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/post/<path:slug>')
def article(slug):
    result = {
        'title': 'test title {}'.format(slug),
        'content': 'test post content',
        'author': 'test author',
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )
    # result = {
    #     'message': 'error msg',
    # }
    #
    # return flask.Response(
    #     json.dumps(result),
    #     # 'error',
    #     status=500,
    #     mimetype='application/json'
    # )


@app.route('/post/<path:slug>/comment')
def comment_list(slug):
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'comments': [
            {
                'id': offset + 1,
                'content': 'test comment content %s' % (offset + 1),
            },
            {
                'id': offset + 2,
                'content': 'test comment content %s' % (offset + 2),
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )

app.run(port=8082, debug=True)
