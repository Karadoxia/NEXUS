import http from 'http';

export async function requestDockerAPI(path: string, method: string = 'GET', body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const options: http.RequestOptions = {
            socketPath: '/var/run/docker.sock',
            path: path,
            method: method,
            headers: {}
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    if (!data) return resolve(true);
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Docker API error (${res.statusCode}): ${data}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (body) {
            req.setHeader('Content-Type', 'application/json');
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}
