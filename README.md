# gatsby-source-sulu

```
npm install gatsby-source-sulu --save
```

This is a Gatsby source plugin for Sulu CMS, it is still under heavy development. 

## Configuration

Unfortunately Sulu CMS does not allow logins that are not 'same-origin', so you will have to configure an additonal auth method that is token based in your symfony/sulu codebase. In the configuration you can then add your **authURL** which is your login_check endpoint and **authToken** which is the name of the token field where the token is stored, additonally you can configure how it will be passed to the api with the **authType** field:

* type = 'header', with the 'Authorization' header
```
Authorization: <authType.name> <yourtoken>
```
* type = 'query', the token gets send with the url
```
http://localhost/admin/api/nodes?<authType.name>=<yourtoken>
```

### sample config
```javascript
resolve: 'gatsby-source-sulu',
options: {
    apiURL: 'http://localhost/admin/api',
    authURL: 'http://localhost/admin/jwt/login',
    metadataURL: 'http://localhost/admin/metadata',
    authToken: 'token',
    webspace: 'webspacename',
    locale: 'en',
    authType: {
        type: 'header',
        name: 'Bearer'
    },
    credentials: {
        username: 'admin',
        password: 'admin'
    }
}
```

## How to Query

all fields should be the same as the normal rest API from Sulu.

### Categories

```
query MyQuery {
  allSuluCategory {
    edges {
      node {
        id
      }
    }
  }
}
```

### Contacts

```
query MyQuery {
  allSuluContact {
    edges {
      node {
        id
      }
    }
  }
}
```

### Media

```
query MyQuery {
  allSuluMedia {
    edges {
      node {
        id
      }
    }
  }
}
```

### Pages

```
query MyQuery {
  allSuluPage {
    edges {
      node {
        id
      }
    }
  }
}
```

### Page Metadata
describes all types of important and autogenereted fields, for example the specific template fields.

```
query MyQuery {
  allSuluPageMetadata {
    edges {
      node {
        id
      }
    }
  }
}
```

### Snippets

```
query MyQuery {
  allSuluSnippet {
    edges {
      node {
        id
      }
    }
  }
}
```

### Analytics

```
query MyQuery {
  allSuluAnalytics {
    edges {
      node {
        id
      }
    }
  }
}
```