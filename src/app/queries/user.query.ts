import { gql } from 'apollo-angular';

export const challengeText = gql`
query Challenge ($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = gql`mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }`

export const createProfile = gql`mutation CreateProfile ($handle: CreateHandle!) {
  createProfile(request:{ 
                handle: $handle,
                profilePictureUri: null,
                followNFTURI: null,
                followModule: null
                }) {
    ... on RelayerResult {
      txHash
    }
    ... on RelayError {
      reason
    }
    __typename
  }
}
`

export const myProfile = gql`query Profiles ($walletId: EthereumAddress!) {
  profiles(request: { ownedBy: [$walletId], limit: 10 }) {
    items {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`

export const refreshToken = gql`mutation Refresh ($token: Jwt!) {
  refresh(request: {
    refreshToken: $token
  }) {
    accessToken
    refreshToken
  }
}
`

export const generateUpdateProfilePicture = gql`mutation CreateSetProfileImageURITypedData ($profileId: ProfileId!, $url: Url) {
  createSetProfileImageURITypedData(request: {
    profileId: $profileId,
    url: $url
  }) {
    id
    expiresAt
    typedData {
      types {
        SetProfileImageURIWithSig {
          name
          type
        }
      }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        imageURI
        profileId
      }
    }
  }
}
`

export const broadcastTx = gql`mutation Broadcast($request: BroadcastRequest!) {
  broadcast(request: $request) {
      ... on RelayerResult {
          txHash
  txId
      }
      ... on RelayError {
          reason
      }
  }
}
`

export const isIndexed = gql`query HasTxHashBeenIndexed ($id: TxId) {
  hasTxHashBeenIndexed(request: { txId: $id }) {
    ... on TransactionIndexedResult {
      indexed
      txReceipt {
        to
        from
        contractAddress
        transactionIndex
        root
        gasUsed
        logsBloom
        blockHash
        transactionHash
        blockNumber
        confirmations
        cumulativeGasUsed
        effectiveGasPrice
        byzantium
        type
        status
        logs {
          blockNumber
          blockHash
          transactionIndex
          removed
          address
          data
          topics
          transactionHash
          logIndex
        }
      }
      metadataStatus {
        status
        reason
      }
    }
    ... on TransactionError {
      reason
      txReceipt {
        to
        from
        contractAddress
        transactionIndex
        root
        gasUsed
        logsBloom
        blockHash
        transactionHash
        blockNumber
        confirmations
        cumulativeGasUsed
        effectiveGasPrice
        byzantium
        type
        status
        logs {
          blockNumber
          blockHash
          transactionIndex
          removed
          address
          data
          topics
          transactionHash
          logIndex
        }
      }
    },
    __typename
  }
}
`