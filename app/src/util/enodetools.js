export const hexToEnode = hex => {
    const chunks = hex.substring(2).match(/.{1,64}/g);

    const enodeHigh = chunks[0].substring(0, 4);
    const enodeLow = chunks[1].substring(60, 65);
    //TODO proper IP conversion
    // const ip = chunks[2]
    const ip = "127.0.0.1";
    const port = parseInt("0x" + chunks[3]);

    return "enode://" + enodeHigh + "..." + enodeLow + "@" + ip + ":" + port;
};

export const hexToObject = hex => {
    const chunks = hex.substring(2).match(/.{1,64}/g);

    const enodeHigh = chunks[0];
    const enodeLow = chunks[1];
    //TODO proper IP conversion
    // const ip = chunks[2]
    const ip = "127.0.0.1";
    const port = parseInt("0x" + chunks[3]);

    return {
        nodeId: enodeHigh + enodeLow,
        ip: ip,
        port: port,
        ipHex: chunks[2]
    };
};

export const enodeToParams = enodeURL => {
    let enodeHigh = null;
    let enodeLow = null;
    let ip = null;
    let port = null;

    const splitURL = enodeURL.split("//")[1];
    if (splitURL) {
        const [enodeId, rawIpAndPort] = splitURL.split("@");
        if (enodeId && enodeId.length === 128) {
            enodeHigh = "0x" + enodeId.slice(0, 64);
            enodeLow = "0x" + enodeId.slice(64);
        }
        if (rawIpAndPort) {
            const [ipAndPort] = rawIpAndPort.split("?");
            if (ipAndPort) {
                [ip, port] = ipAndPort.split(":");
            }
        }
    }
    return {
        enodeHigh,
        enodeLow,
        ip: ip ? getHexIpv4(ip) : null,
        port
    };

    // const splitUrl = enodeURL.split("//")[1].split("@");
    // const enodeId = splitUrl[0];
    // console.log(enodeId.length)
    // const enodeHigh = "0x" + enodeId.slice(0, 64);
    // const enodeLow = "0x" + enodeId.slice(64);
    // const ip = splitUrl[1].split(":")[0];
    // const port = splitUrl[1].split(":")[1].split("?")[0];
    //
    // const params = {
    //     enodeHigh,
    //     enodeLow,
    //     ip: getHexIpv4(ip),
    //     port
    // };
    //
    // return params;
};

export const isValidEnode = str => {
    const params = enodeToParams(str);
    console.log(params);
    const hasValues = !Object.values(params).some(value => !value);
    return hasValues;
};

function getHexIpv4(stringIp) {
    const splitIp = stringIp.split(".");
    return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(
        splitIp[1]
    )}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

const toHex = number => {
    const num = Number(number).toString(16);
    return num.length < 2 ? `0${num}` : num;
};

export function isSameEnodeList(list, another) {
    if (list.length !== another.length) {
        return false;
    }

    for (var i = 0; i < list.length; i++) {
        if (
            list[i].nodeId !== another[i].nodeId ||
            list[i].ip !== another[i].ip ||
            list[i].port !== another[i].port
        ) {
            return false;
        }
    }

    return true;
}

export function containsEnodeObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (
            obj.nodeId === list[i].nodeId &&
            obj.ip === list[i].ip &&
            obj.port === list[i].port
        ) {
            return true;
        }
    }

    return false;
}

export const identifierToParams = identifier => {
    const [enodeHigh, enodeLow, ip, port] = identifier.split("_");
    return {
        enodeHigh,
        enodeLow,
        ip,
        port,
        identifier
    };
};

export const paramsToIdentifier = ({ enodeHigh, enodeLow, ip, port }) => {
    return `${enodeHigh}_${enodeLow}_${ip}_${port}`;
};
